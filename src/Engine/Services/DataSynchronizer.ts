import { IDataSynchronizer } from "storyScript/Interfaces/services/dataSynchronizer";
import { IUpdatable } from "storyScript/Interfaces/updatable";
import { RuntimeProperties } from "storyScript/runtimeProperties";
import { getKeyPropertyNames, getPlural, getSingular, getValue, propertyMatch } from "storyScript/utilities";

export class DataSynchronizer implements IDataSynchronizer {

    private _runtimeProperties = [
        <string>RuntimeProperties.ActiveNode,
        <string>RuntimeProperties.Added,
        <string>RuntimeProperties.Deleted,
        <string>RuntimeProperties.ConversationLog,
        <string>RuntimeProperties.Description,
        <string>RuntimeProperties.Descriptions,
        <string>RuntimeProperties.HasVisited,
        <string>RuntimeProperties.Log,
        <string>RuntimeProperties.Nodes,
        <string>RuntimeProperties.Picture,
        <string>RuntimeProperties.StartNode,
        <string>RuntimeProperties.IsPreviousLocation,
        <string>RuntimeProperties.CollectionPicture,
        <string>RuntimeProperties.Coords,
        <string>RuntimeProperties.Shape,
    ];

    updateModifiedEntities = (
        entities: IUpdatable[],
        pristineEntities: Record<string, Record<string, any>>, 
        pristineProperty: any,       
        parentEntity?: IUpdatable,
        pristineParentEntity?: IUpdatable
    ): void => {
        const removedEntities = [];
    
        // Loop over the current entities to update the values on entities that changed.
        entities.forEach(entity => {
            if (entity[RuntimeProperties.Deleted]) {
                return;
            }
    
            // Find the pristine entity to update from in case of a change.
            const pristinceCollection = pristineEntities[getPlural(entity.type)];
            const pristine = pristinceCollection && pristinceCollection[entity.id];
    
            // If a pristine entity is not found, it is no longer part of the definitions. This happens when the 
            // entity private was renamed or the private was deleted. Delete it.
            if (!pristine) {
                removedEntities.push(entity);
                return;
            }
    
            const update = this.shouldUpdate(entity, pristine, parentEntity, pristineParentEntity);
            this.updateModifiedEntity(entity, pristine, pristineEntities, update, parentEntity, pristineParentEntity, entity.type);      
        });
    
        removedEntities.forEach(e => {
            console.log(this.getUpdateCollectionLogMessage(e, parentEntity, 'Removing', 'from'));
            entities.remove(e)
        });
    
        // Move deleted entities to the deleted shadow array.
        entities.filter(e => e[RuntimeProperties.Deleted]).forEach(e => {
            const entityMatch = pristineEntities[getPlural(e.type)][e.id];
            entities.delete(entityMatch);
        });
    
        if (!pristineProperty?.length) {
            return;
        }
    
        // Remove entities that are no longer on the pristine collection, but only when they were not added programmatically.
        entities.filter(c => !pristineProperty.find(p => p.id === c.id)).map(e => {
            if (e[RuntimeProperties.Added]) {
                return;
            }
                    
            console.log(this.getUpdateCollectionLogMessage(e, parentEntity, 'Removing', 'from'));
            entities.remove(e);
        });
    
        // Add entities that are on the pristine entity but not on the current entity.
        // These have been added during editing.
        pristineProperty.filter(p => !entities.find(c => c.id === p.id)).map(p => {
            console.log(this.getUpdateCollectionLogMessage(p, parentEntity, 'Adding', 'to'));
            entities.push(p);
        });
    }
    
    updateModifiedEntity = (
        entity: IUpdatable, 
        pristineEntity: IUpdatable, 
        pristineEntities: Record<string, Record<string, any>>,
        updateValues?: boolean,
        parentEntity?: IUpdatable,
        pristineParentEntity?: IUpdatable,
        parentProperty?: string
    ): void => {
        if (Array.isArray(entity) && Array.isArray(pristineEntity)) {
            if (entity.length > 0 || pristineEntity.length > 0) {
                this.updateArray(entity, pristineEntity, pristineEntities, updateValues, parentEntity, pristineParentEntity, parentProperty);
            }
    
            return;
        }
    
        updateValues ??= false;
        const propertyNames = Object.keys(entity);
    
        propertyNames.forEach(p => {
            if (p === RuntimeProperties.BuildTimeStamp) {
                return;
            }
    
            const currentProperty = entity[p];
            const pristineProperty = this.isEntity(currentProperty) ? pristineEntities[getPlural(currentProperty.type)][currentProperty.id] : pristineEntity[p];
    
            // If the property currently exists on the entity but isn't part of the new definition, delete it now.
            if (updateValues && typeof pristineProperty === 'undefined') {
                this.deleteRemovedProperty(p, currentProperty, entity, parentEntity, parentProperty)
                return;
            }
    
            // Update the current property using the pristine property value. When dealing with an object, update
            // its property values recursively. When dealing with a collection of entity objects, update these recursively.
            if (this.isEntityArray(currentProperty, pristineProperty)) {
                this.updateModifiedEntities(currentProperty, pristineEntities, pristineProperty, entity, pristineEntity);
                return;
            }
    
            else if (this.isEntity(currentProperty)) {
                const update = this.shouldUpdate(currentProperty, pristineProperty);
                this.updateModifiedEntity(currentProperty, pristineEntities[getPlural(currentProperty.type)][currentProperty.id], pristineEntities, update, parentEntity, pristineParentEntity, p);
                return;
            }
    
            if (typeof currentProperty === 'object' && currentProperty && pristineProperty) {
                this.updateModifiedEntity(currentProperty, pristineProperty, pristineEntities, updateValues, parentEntity ?? entity, pristineParentEntity ?? pristineEntity, p);
                return;
            } 
    
            this.updatePropertyValue(p, entity, pristineProperty, parentEntity, parentProperty, updateValues);
        });
    
        this.addNewProperties(entity, pristineEntity, parentEntity, propertyNames, updateValues);
    
        // Update the entity build stamp now, to indicate the entity is back in sync with the most recent version.
        if (entity[RuntimeProperties.BuildTimeStamp]) {
            entity[RuntimeProperties.BuildTimeStamp] = pristineEntity[RuntimeProperties.BuildTimeStamp];
        }
    }

    private addNewProperties = (
        entity: IUpdatable, 
        pristineEntity: IUpdatable, 
        parentEntity: IUpdatable, 
        propertyNames: string[], 
        updateValues: boolean
    ) => {
        if (!updateValues) {
            return;
        }
    
        const newPropertyNames = Object.keys(pristineEntity).filter(p => propertyNames.indexOf(p) === -1);
    
        newPropertyNames.forEach(p => {
            const pristineValue = pristineEntity[p];
    
            if (typeof pristineValue === 'undefined') {
                return;
            }
    
            const logValue = pristineValue?.id ?? pristineValue?.name ?? pristineValue;
            console.log(this.getUpdateValueLogMessage(p, logValue, entity, 'Adding', 'to', parentEntity));
            entity[p] = pristineValue;
        });
    }
    
    private shouldUpdate(entity: IUpdatable, pristine: IUpdatable, parentEntity?: IUpdatable, pristineParent?: IUpdatable): boolean {
        let update = entity[RuntimeProperties.BuildTimeStamp] < pristine[RuntimeProperties.BuildTimeStamp];
    
        if (!update && parentEntity) {
            update = parentEntity[RuntimeProperties.BuildTimeStamp] < pristineParent[RuntimeProperties.BuildTimeStamp];
        }
    
        return update;
    }
    
    private updateArray (
            entity: any[], 
            pristineEntity: any[], 
            pristineEntities: Record<string, Record<string, any>>, 
            updateValues: boolean,
            parentEntity?: IUpdatable,
            pristineParentEntity?: IUpdatable,
            parentProperty?: string
        ): void {
    
        const matchedItems = this.getMatchingItems(entity, pristineEntity);
        const newItems = this.getMissingItems(entity, pristineEntity).filter(e => !matchedItems.includes(e));
        let addedItems = this.getMissingItems(pristineEntity, entity);
        const itemsToDelete = addedItems.filter(i => !i[RuntimeProperties.Added]);
        addedItems = addedItems.filter(i => i[RuntimeProperties.Added]);
    
        matchedItems.concat(addedItems).forEach(i => {
            const currentValue: any = this.getMatchingItems([i], entity)[0];
            const pristineValue: any = this.getMatchingItems(pristineEntity, [i])[0];
    
            if (i[RuntimeProperties.Deleted]) {
                entity.delete(currentValue);
                return;
            }
    
            if (pristineValue !== undefined) {
                this.updateModifiedEntity(currentValue, pristineValue, pristineEntities, updateValues, parentEntity, pristineParentEntity, parentProperty);
            } else {
                this.removeDeletedEntries(currentValue);
            }
        }); 
    
        if (!updateValues || (newItems.length === 0 && itemsToDelete.length === 0)) {
            return;
        }
    
        this.logUpdateCollection(itemsToDelete, parentProperty, parentEntity, newItems);
    
        entity.length = 0;
        matchedItems.concat(newItems).concat(addedItems).forEach(i => {
            entity.push(i);
        });
    }
    
    private deleteRemovedProperty = (propertyName: string, currentProperty: any, entity: any, parentEntity: any, parentProperty: string) => {
        if (typeof currentProperty === 'undefined') {
            return;
        }
    
        if (this._runtimeProperties.indexOf(propertyName) > -1) {
            return;
        }
    
        // If the current property is an array of items, only remove the deleted items.
        if (Array.isArray(currentProperty)) {
            currentProperty.removeDeleted();
            return;
        }
    
        this.logPropertyChange(entity, parentProperty, undefined, propertyName, parentEntity, 'Removing', 'from');
        delete entity[propertyName];
    }
    
    private updatePropertyValue = (
        propertyName: string, 
        entity: any, 
        pristineProperty: any, 
        parentEntity: IUpdatable, 
        parentProperty: any, 
        updateValues: boolean
    ) => {
        const pristineValue = getValue(pristineProperty);
        
        if (!updateValues || this._runtimeProperties.indexOf(propertyName) > -1) {
            return;
        }
    
        if (getValue(entity[propertyName]) === pristineValue || typeof entity[propertyName] === 'function') {
            return;
        }
    
        this.logPropertyChange(entity, parentProperty, pristineValue, propertyName, parentEntity, 'Updating', 'on');
        entity[propertyName] = pristineValue;
    }
    
    private logPropertyChange = (
        entity: any, 
        parentProperty: any, 
        pristineValue: string, 
        propertyName: string, 
        parentEntity: { type: string; id: string; },
        prefix: string,
        join: string
    ) => {
        const parentMessage = entity.type ? '' : `${parentProperty} `;
        const messageValue = pristineValue;
        const baseMessage = `${prefix} ${parentMessage}${propertyName} (value: ${messageValue}) ${join} `;
        const messageExtension = entity.type ? `${entity.type} ${entity.id}` : `${parentEntity?.type} ${parentEntity?.id}`;
    
        console.log(baseMessage + messageExtension);
    }
    
    private logUpdateCollection = (itemsToDelete: any[], parentProperty: string, parentEntity: IUpdatable, newItems: any[]) => {
        parentProperty = getSingular(parentProperty);
    
        itemsToDelete.forEach(i => {
            console.log(this.getUpdateObjectLogMessage(parentProperty, this.getItemName(i), parentEntity, 'Removing', 'from', parentEntity));
        });
    
        newItems.forEach(i => {
            console.log(this.getUpdateObjectLogMessage(parentProperty, this.getItemName(i), parentEntity, 'Adding', 'to', parentEntity));
        });
    }
    
    private getUpdateValueLogMessage = (name: string, value: any, target: IUpdatable | string, prefix: string, join: string, parent?: IUpdatable) => {
        if (Array.isArray(value)) {
            value = `array of ${name}`;
        }
        
        if (typeof value === 'object' && value) {
            const { first, second } = getKeyPropertyNames(value);
            value = first ?? second ?? Object.keys(value)[0];
        }
    
        return this.getUpdateObjectLogMessage(name, `(value: ${value})`, target, prefix, join, parent);
    }
    
    private getUpdateObjectLogMessage = (name: string, value: any, target: IUpdatable | string, prefix: string, join: string, parent?: IUpdatable): string => {
        const targetMessage = typeof target === 'string' ? target : target?.type ? `${target?.type} ${target?.id}` : `${parent?.type} ${parent?.id}`;
        const parentMessage = (<IUpdatable>target).type && parent?.type && target !== parent ? ` on ${parent.type} ${parent.id}` : '';
        return `${prefix} ${name} ${value} ${join} ${targetMessage}${parentMessage}.`;
    }
    
    private getUpdateCollectionLogMessage = (entity: IUpdatable, parent: IUpdatable, prefix: string, join: string): string => {
        const baseMessage = `${prefix} ${entity.type} ${entity.id}`;
        return parent ? `${baseMessage} ${join} ${parent.type} ${parent.id}.` : `${baseMessage}.`
    }
    
    private isEntityArray = (entities: IUpdatable[], pristineEntities: IUpdatable[]): boolean => {
        return (Array.isArray(entities) && this.isEntity(entities[0])) || (Array.isArray(pristineEntities) && this.isEntity(pristineEntities[0]));
    }
    
    private isEntity = (entity: IUpdatable): boolean => {
        return typeof entity?.type !== 'undefined' && typeof entity?.id !== 'undefined';
    }
    
    private getMatchingItems = (current: any[], pristine: any[]): any[] => {
        if (current.length === 0) {
            return [];
        }
    
        const matchedPristineItems = pristine.filter(e => current.find(p => propertyMatch(e, p)));
        return  current.filter(c => matchedPristineItems.find(i => propertyMatch(c, i)));
    }
    
    private getMissingItems = (current: any[], pristine: any[]): any[] => {
        if (current.length === 0) {
            return pristine;
        }
    
        return pristine.filter(e => !current.find(p => propertyMatch(e, p)));
    }
    
    private getItemName = (item: any): string => {
        const { first, second } = getKeyPropertyNames(item);
        return item[first] ?? item[second] ?? Object.keys(item)[0] ?? 'unknown';
    }
    
    private removeDeletedEntries = (item: any) => {
        if (typeof item === undefined) {
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