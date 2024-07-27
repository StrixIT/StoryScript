import { IDataSynchronizer } from "storyScript/Interfaces/services/dataSynchronizer";
import { IUpdatable } from "storyScript/Interfaces/updatable";
import { RuntimeProperties } from "storyScript/runtimeProperties";
import {getKeyPropertyNames, getPlural, isDataRecord, propertyMatch} from "storyScript/utilities";
import {FunctionType} from "../../../constants.ts";

export class DataSynchronizer implements IDataSynchronizer {
    updateModifiedEntities = (
        entities: IUpdatable[],
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
        entities.filter(e => e[RuntimeProperties.Deleted]).forEach(e => {
            const entityMatch = pristineEntities[getPlural(e.type)][e.id];
            entities.delete(entityMatch, true);
        });
    }
    
    updateModifiedEntity = (
        entity: any, 
        pristineEntity: any, 
        pristineEntities: Record<string, Record<string, any>>,
        parentEntity?: any,
        pristineParentEntity?: any,
        parentProperty?: string
    ): void => {
        if (isDataRecord(pristineEntity?.[0] ?? [])) {
            pristineEntity.forEach((p: any[]) => {
                const match = entity.find((e: any[]) => e[0] === p[0]);
                
                if (!match) {
                    return;
                }
                
                if (match[RuntimeProperties.Deleted]) {
                    return;
                }
                else if (typeof(p[1]) === FunctionType) {
                    match[1] = p[1];
                } else {
                    this.updateModifiedEntity(match[1], p[1], pristineEntities, entity, pristineEntity, '1');
                }
            });

            this.markEntriesAsDeleted(entity);
            return;
        }
        
        if (Array.isArray(entity) && Array.isArray(pristineEntity)) {
            if (entity.length > 0 || pristineEntity.length > 0) {
                this.updateArray(entity, pristineEntity, pristineEntities, parentEntity, pristineParentEntity, parentProperty);
            }
    
            return;
        }
        
        const propertyNames= Object.keys(pristineEntity);
    
        propertyNames.forEach(p => {
            const currentProperty = entity[p];
            const pristineProperty = this.isEntity(currentProperty) ? pristineEntities[getPlural(currentProperty.type)][currentProperty.id] : pristineEntity[p];
    
            // Update the current property using the pristine property value. When dealing with an object, update
            // its property values recursively. When dealing with a collection of entity objects, update these recursively.
            if (this.isEntityArray(currentProperty, pristineProperty)) {
                this.updateModifiedEntities(currentProperty, pristineEntities, entity, pristineEntity);
                return;
            }
    
            else if (this.isEntity(currentProperty)) {
                this.updateModifiedEntity(currentProperty, pristineEntities[getPlural(currentProperty.type)][currentProperty.id], pristineEntities, parentEntity, pristineParentEntity, p);
                return;
            }
    
            if (typeof currentProperty === 'object' && currentProperty && pristineProperty) {
                this.updateModifiedEntity(currentProperty, pristineProperty, pristineEntities, entity, pristineEntity, p);
                return;
            } 
    
            this.updatePropertyValue(p, entity, parentEntity, pristineProperty);
        });
    }
    
    private updateArray (
            entity: any[], 
            pristineEntity: any[], 
            pristineEntities: Record<string, Record<string, any>>,
            parentEntity?: IUpdatable,
            pristineParentEntity?: IUpdatable,
            parentProperty?: string
        ): void {
        
        const matchedItems = pristineEntity.filter(e => entity.find(p => propertyMatch(e, p)));
        const itemsToAdd = entity.filter(e => !pristineEntity.find(p => propertyMatch(e, p)));
    
        matchedItems.forEach(i => {
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
    }
    
    private markEntriesAsDeleted = (item: any[]) => {
        // Mark deleted items as such in the array
        const itemsToDelete = item.filter(i => i[RuntimeProperties.Deleted]);
        itemsToDelete.forEach(i => item.delete(i, false));
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
    
    private isEntityArray = (entities: IUpdatable[], pristineEntities: IUpdatable[]): boolean => {
        return (Array.isArray(entities) && this.isEntity(entities[0])) || (Array.isArray(pristineEntities) && this.isEntity(pristineEntities[0]));
    }
    
    private isEntity = (entity: IUpdatable): boolean => {
        return typeof entity?.type !== 'undefined' && typeof entity?.id !== 'undefined';
    }
    
    private removeDeletedEntries = (item: any) => {
        if (item === undefined) {
            return;
        }
    
        const properties = Object.keys(item);
    
        properties.forEach(p => {
            const value = item[p];
    
            if (Array.isArray(value)) {
                value.removeDeleted();
    
                value.forEach(e => {
                    this.removeDeletedEntries(e);
                })
            } else if (typeof value === 'object') {
                this.removeDeletedEntries(value);
            }
        });
    }
}