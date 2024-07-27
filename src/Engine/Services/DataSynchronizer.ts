import { IDataSynchronizer } from "storyScript/Interfaces/services/dataSynchronizer";
import { RuntimeProperties } from "storyScript/runtimeProperties";
import {getKeyPropertyNames, getPlural, isDataRecord, propertyMatch} from "storyScript/utilities";
import {FunctionType} from "../../../constants.ts";
import {IEntity} from "storyScript/Interfaces/entity.ts";

export class DataSynchronizer implements IDataSynchronizer {
    updateModifiedEntities = (
        entities: IEntity[],
        pristineEntities: Record<string, Record<string, any>>,
        parentEntity?: any,
        pristineParentEntity?: any
    ): void => {
        const removedEntities = [];
    
        // Loop over the current entities to update the values on entities that changed.
        entities.forEach(entity => {
            if (entity[RuntimeProperties.Deleted]) {
                return;
            }
    
            // Find the pristine entity to update from in case of a change.
            const pristineCollection = pristineEntities[getPlural(entity.type)];
            const pristine = pristineCollection?.[entity.id];
    
            // If a pristine entity is not found, it is no longer part of the definitions. This happens when the 
            // entity function was renamed or the function was deleted. Delete it.
            if (!pristine) {
                removedEntities.push(entity);
                return;
            }
            
            this.updateModifiedEntity(entity, pristine, pristineEntities, parentEntity, pristineParentEntity, entity.type);      
        });
    
        removedEntities.forEach(e => {
            console.log(`Entity '${e.id}'of type '${e.type}' was deleted. Removing it from the world data.`);
            entities.remove(e)
        });
    
        // Move deleted entities to the deleted shadow array.
        this.markEntriesAsDeleted(entities);
    }
    
    updateModifiedEntity = (
        entity: any, 
        pristineEntity: any, 
        pristineEntities: Record<string, Record<string, any>>,
        parentEntity?: any,
        pristineParentEntity?: any,
        parentProperty?: string
    ): void => {
        if (this.updateDataRecord(entity, pristineEntity, pristineEntities)) {
            return;
        }
        
        if (this.updateArray(entity, pristineEntity, pristineEntities, parentEntity, pristineParentEntity, parentProperty)) {
            return;
        }
        
        const propertyNames= Object.keys(pristineEntity);
    
        propertyNames.forEach(p => {
            let currentProperty: any;
            let pristineProperty = pristineEntity[p];
            pristineProperty = this.isEntity(pristineEntity[p]) ? pristineEntities[getPlural(pristineProperty.type)][pristineProperty.id] : pristineProperty;
            
            if (typeof entity[p] === 'undefined') {
                if (Array.isArray(pristineProperty)) {
                    entity[p] = [];
                    this.updateArray(entity[p], pristineEntity[p], pristineEntities, entity, pristineEntity, p);
                    return;
                }
                else if (typeof pristineProperty === 'object') {
                    entity[p] = {};
                }
                else {
                    entity[p] = pristineProperty;
                    return;
                }
            }

            currentProperty =  entity[p];
            
            // Update the current property using the pristine property value. When dealing with an object, update
            // its property values recursively. When dealing with a collection of entity objects, update these recursively.
            if (this.isEntityArray(currentProperty, pristineProperty)) {
                const addedItems = pristineProperty.filter((e: any) => !currentProperty.find((p: any) => propertyMatch(e, p)))
                addedItems.forEach((a: any) => currentProperty.push(a));
                this.updateModifiedEntities(currentProperty, pristineEntities, entity, pristineEntity);
                return;
            }
            else if (this.isEntity(currentProperty)) {
                this.updateModifiedEntity(currentProperty, pristineEntities[getPlural(currentProperty.type)][currentProperty.id], pristineEntities, parentEntity, pristineParentEntity, p);
                return;
            }
            else if (typeof currentProperty === 'object' && currentProperty && pristineProperty) {
                this.updateModifiedEntity(currentProperty, pristineProperty, pristineEntities, entity, pristineEntity, p);
                return;
            } 
    
            this.updatePropertyValue(p, entity, parentEntity, pristineProperty);
        });
    }
    
    private updateDataRecord = (entity: any, pristineEntity: any, pristineEntities: Record<string, Record<string, IEntity>>): boolean => {
        if (!isDataRecord(pristineEntity?.[0] ?? [])) {
            return false;
        }
        
        pristineEntity.forEach((p: any[]) => {
            const match = entity.find((e: any[]) => e[0] === p[0]);

            if (!match || match[RuntimeProperties.Deleted]) {
                return;
            }
            else if (typeof(p[1]) === FunctionType) {
                match[1] = p[1];
            } else {
                this.updateModifiedEntity(match[1], p[1], pristineEntities, entity, pristineEntity, '1');
            }
        });

        this.markEntriesAsDeleted(entity);
        return true;
    }
    
    private updateArray (
            entity: any[], 
            pristineEntity: any[], 
            pristineEntities: Record<string, Record<string, any>>,
            parentEntity?: IEntity,
            pristineParentEntity?: IEntity,
            parentProperty?: string
        ): boolean {
        if (!Array.isArray(entity) || !Array.isArray(pristineEntity) || (entity.length == 0 && pristineEntity.length == 0)) {
            return false;
        }
        
        const existingItems = entity.filter(e => !pristineEntity.find(p => propertyMatch(e, p)));
        const matchedItems = pristineEntity.filter(e => entity.find(p => propertyMatch(e, p)));
        const itemsToAdd = pristineEntity.filter(e => !entity.find(p => propertyMatch(e, p)));
        
        existingItems.concat(matchedItems).forEach(i => {
            const currentValue: any = entity.find(p => propertyMatch(i, p));

            if (!i[RuntimeProperties.Deleted]) {
                this.updateModifiedEntity(currentValue, i, pristineEntities, parentEntity, pristineParentEntity, parentProperty);
            }
            
            itemsToAdd.push(currentValue);
        });
    
        entity.length = 0;
        itemsToAdd.forEach(i => {
            entity.push(i);
        });

        this.markEntriesAsDeleted(entity);
        return true;
    }
    
    private markEntriesAsDeleted = (item: any[]) => {
        // Mark deleted items as such in the array
        const itemsToDelete = item.filter(i => i[RuntimeProperties.Deleted]);
        itemsToDelete.forEach(i => item.delete(i));
    }
    
    private updatePropertyValue = (
        propertyName: string, 
        entity: any, 
        parentEntity: any,
        pristineProperty: any,
    ) => {
        const currentValue = entity[propertyName];
        
        // If there is no value for this property on the object yet, it wasn't changed during runtime. Set it now. 
        // If there is, it was changed during runtime and should be left alone.
        if (currentValue === undefined) {
            entity[propertyName] = pristineProperty;
        }
        else if (currentValue !== pristineProperty) {
            if (typeof currentValue === FunctionType && typeof pristineProperty === FunctionType && currentValue.toString() === pristineProperty.toString()) {
                return;
            }
            
            console.log(`Property ${propertyName} on ${this.getItemName(entity) ?? this.getItemName(parentEntity)} was modified. It's value of '${currentValue}' is retained.`);
        }
    }

    private getItemName = (item: any): string => {
        const { first, second } = getKeyPropertyNames(item);
        return item[first] ?? item[second] ?? Object.keys(item)[0] ?? 'unknown';
    }
    
    private isEntityArray = (entities: IEntity[], pristineEntities: IEntity[]): boolean => {
        return (Array.isArray(entities) && this.isEntity(entities[0])) || (Array.isArray(pristineEntities) && this.isEntity(pristineEntities[0]));
    }
    
    private isEntity = (entity: IEntity): boolean => {
        return typeof entity?.type !== 'undefined' && typeof entity?.id !== 'undefined';
    }
}