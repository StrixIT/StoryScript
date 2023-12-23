import { RuntimeProperties } from "storyScript/runtimeProperties";
import { IUpdatable } from "storyScript/updatable";
import { getKeyPropertyNames, getPlural, getSingular, getValue, propertyMatch } from "storyScript/utilities";

const _runtimeProperties = [
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

export function updateModifiedEntities(
    entities: IUpdatable[],
    pristineEntities: Record<string, Record<string, any>>, 
    pristineProperty: any,       
    parentEntity?: IUpdatable,
    pristineParentEntity?: IUpdatable
): void {
    const removedEntities = [];

    // Loop over the current entities to update the values on entities that changed.
    entities.forEach(entity => {
        if (entity[RuntimeProperties.Deleted]) {
            return;
        }

        // Find the pristine entity to update from in case of a change.
        const pristinceCollection = pristineEntities[getPlural(entity.type)];

        // Todo: test this, then consolidate.
        if (!pristinceCollection) {
            throw new Error('Pristine collection should exist!');
        }

        const pristine = pristinceCollection && pristinceCollection[entity.id];

        // If a pristine entity is not found, it is no longer part of the definitions. This happens when the 
        // entity function was renamed or the function was deleted. Delete it.
        if (!pristine) {
            removedEntities.push(entity);
            return;
        }

        const update = shouldUpdate(entity, pristine, parentEntity, pristineParentEntity);
        updateModifiedEntity(entity, pristine, pristineEntities, update, parentEntity, pristineParentEntity, entity.type);      
    });

    removedEntities.forEach(e => {
        console.log(getUpdateCollectionLogMessage(e, parentEntity, 'Removing', 'from'));
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
                
        console.log(getUpdateCollectionLogMessage(e, parentEntity, 'Removing', 'from'));
        entities.remove(e);
    });

    // Add entities that are on the pristine entity but not on the current entity.
    // These have been added during editing.
    pristineProperty.filter(p => !entities.find(c => c.id === p.id)).map(p => {
        console.log(getUpdateCollectionLogMessage(p, parentEntity, 'Adding', 'to'));
        entities.push(p);
    });
}

export function updateModifiedEntity (
    entity: IUpdatable, 
    pristineEntity: IUpdatable, 
    pristineEntities: Record<string, Record<string, any>>,
    updateValues?: boolean,
    parentEntity?: IUpdatable,
    pristineParentEntity?: IUpdatable,
    parentProperty?: string
): void {
    if (Array.isArray(entity) && Array.isArray(pristineEntity)) {
        if (entity.length > 0 || pristineEntity.length > 0) {
            updateArray(entity, pristineEntity, pristineEntities, updateValues, parentEntity, pristineParentEntity, parentProperty);
        }

        return;
    }

    updateValues ??= false;
    const propertyNames = Object.keys(entity);

    propertyNames.forEach(p => {
        if (p === 'buildTimeStamp') {
            return;
        }

        const currentProperty = entity[p];
        const pristineProperty = isEntity(currentProperty) ? pristineEntities[getPlural(currentProperty.type)][currentProperty.id] : pristineEntity[p];

        // If the property currently exists on the entity but isn't part of the new definition, delete it now.
        if (updateValues && typeof pristineProperty === 'undefined') {
            deleteRemovedProperty(p, currentProperty, entity, parentEntity, parentProperty)
            return;
        }

        // Update the current property using the pristine property value. When dealing with an object, update
        // its property values recursively. When dealing with a collection of entity objects, update these recursively.
        if (isEntityArray(currentProperty, pristineProperty)) {
            updateModifiedEntities(currentProperty, pristineEntities, pristineProperty, entity, pristineEntity);
            return;
        }

        else if (isEntity(currentProperty)) {
            const update = shouldUpdate(currentProperty, pristineProperty);
            updateModifiedEntity(currentProperty, pristineEntities[getPlural(currentProperty.type)][currentProperty.id], pristineEntities, update, parentEntity, pristineParentEntity, p);
            return;
        }

        if (typeof currentProperty === 'object' && currentProperty && pristineProperty) {
            updateModifiedEntity(currentProperty, pristineProperty, pristineEntities, updateValues, parentEntity ?? entity, pristineParentEntity ?? pristineEntity, p);
            return;
        } 

        updatePropertyValue(p, entity, pristineProperty, parentEntity, parentProperty, updateValues);
    });

    addNewProperties(entity, pristineEntity, parentEntity, pristineParentEntity, propertyNames, updateValues);

    // Update the entity build stamp now, to indicate the entity is back in sync with the most recent version.
    if (entity.buildTimeStamp) {
        entity.buildTimeStamp = pristineEntity.buildTimeStamp;
    }
}

function addNewProperties(entity: IUpdatable, pristineEntity: IUpdatable, parentEntity: IUpdatable, pristineParentEntity: IUpdatable, propertyNames: string[], updateValues: boolean) {
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
        console.log(getUpdateValueLogMessage(p, logValue, entity, 'Adding', 'to', parentEntity));
        entity[p] = pristineValue;
    });
}

function shouldUpdate(entity: IUpdatable, pristine: IUpdatable, parentEntity?: IUpdatable, pristineParent?: IUpdatable): boolean {
    let update = entity.buildTimeStamp < pristine.buildTimeStamp;

    if (!update && parentEntity) {
        update = parentEntity.buildTimeStamp < pristineParent.buildTimeStamp;
    }

    return update;
}

function updateArray (
        entity: any[], 
        pristineEntity: any[], 
        pristineEntities: Record<string, Record<string, any>>, 
        updateValues: boolean,
        parentEntity?: IUpdatable,
        pristineParentEntity?: IUpdatable,
        parentProperty?: string
    ): void {

    const matchedItems = getMatchingItems(entity, pristineEntity);
    const newItems = getMissingItems(entity, pristineEntity).filter(e => !matchedItems.includes(e));
    let addedItems = getMissingItems(pristineEntity, entity);
    const itemsToDelete = addedItems.filter(i => !i[RuntimeProperties.Added]);
    addedItems = addedItems.filter(i => i[RuntimeProperties.Added]);

    matchedItems.concat(addedItems).forEach(i => {
        const currentValue: any = getMatchingItems([i], entity)[0];
        const pristineValue: any = getMatchingItems(pristineEntity, [i])[0];

        if (i[RuntimeProperties.Deleted]) {
            entity.delete(currentValue);
            return;
        }

        if (pristineValue !== undefined) {
            updateModifiedEntity(currentValue, pristineValue, pristineEntities, updateValues, parentEntity, pristineParentEntity, parentProperty);
        } else {
            removeDeletedEntries(currentValue);
        }
    }); 

    if (!updateValues || (newItems.length === 0 && itemsToDelete.length === 0)) {
        return;
    }

    logUpdateCollection(itemsToDelete, parentProperty, parentEntity, newItems);

    entity.length = 0;
    matchedItems.concat(newItems).concat(addedItems).forEach(i => {
        entity.push(i);
    });
}

function deleteRemovedProperty (propertyName: string, currentProperty: any, entity: any, parentEntity: any, parentProperty: string) {
    if (typeof currentProperty === 'undefined') {
        return;
    }

    if (_runtimeProperties.indexOf(propertyName) > -1) {
        return;
    }

    // If the current property is an array of items that are all marked as deleted, remove the deleted
    // items but keep the aray.
    if (Array.isArray(currentProperty) && currentProperty.all(e => e[RuntimeProperties.Deleted])) {
        currentProperty.clear();
        return;
    }

    logPropertyChange(entity, parentProperty, undefined, propertyName, parentEntity, 'Removing', 'from');
    delete entity[propertyName];
}

function updatePropertyValue(propertyName: string, entity: any, pristineProperty: any, parentEntity: { type: string, id: string }, parentProperty: any, updateValues: boolean) {
    const pristineValue = getValue(pristineProperty);
    
    if (!updateValues || _runtimeProperties.indexOf(propertyName) > -1) {
        return;
    }

    if (getValue(entity[propertyName]) === pristineValue || typeof entity[propertyName] === 'function') {
        return;
    }

    logPropertyChange(entity, parentProperty, pristineValue, propertyName, parentEntity, 'Updating', 'on');
    entity[propertyName] = pristineValue;
}

function logPropertyChange(
    entity: any, 
    parentProperty: any, 
    pristineValue: string, 
    propertyName: string, 
    parentEntity: { type: string; id: string; },
    prefix: string,
    join: string
) {
    const parentMessage = entity.type ? '' : `${parentProperty} `;
    const messageValue = pristineValue;
    const baseMessage = `${prefix} ${parentMessage}${propertyName} (value: ${messageValue}) ${join} `;
    const messageExtension = entity.type ? `${entity.type} ${entity.id}` : `${parentEntity?.type} ${parentEntity?.id}`;

    console.log(baseMessage + messageExtension);
}

function logUpdateCollection(itemsToDelete: any[], parentProperty: string, parentEntity: IUpdatable, newItems: any[]) {
    parentProperty = getSingular(parentProperty);

    itemsToDelete.forEach(i => {
        console.log(getUpdateObjectLogMessage(parentProperty, getItemName(i), parentEntity, 'Removing', 'from', parentEntity));
    });

    newItems.forEach(i => {
        console.log(getUpdateObjectLogMessage(parentProperty, getItemName(i), parentEntity, 'Adding', 'to', parentEntity));
    });
}

function getUpdateValueLogMessage (name: string, value: any, target: IUpdatable | string, prefix: string, join: string, parent?: IUpdatable) {
    if (Array.isArray(value)) {
        value = `array of ${name}`;
    }
    
    if (typeof value === 'object' && value) {
        const { first, second } = getKeyPropertyNames(value);
        value = first ?? second ?? Object.keys(value)[0];
    }

    return getUpdateObjectLogMessage(name, `(value: ${value})`, target, prefix, join, parent);
}

function getUpdateObjectLogMessage (name: string, value: any, target: IUpdatable | string, prefix: string, join: string, parent?: IUpdatable): string {
    const targetMessage = typeof target === 'string' ? target : target?.type ? `${target?.type} ${target?.id}` : `${parent?.type} ${parent?.id}`;
    const parentMessage = (<IUpdatable>target).type && parent?.type && target !== parent ? ` on ${parent.type} ${parent.id}` : '';
    return `${prefix} ${name} ${value} ${join} ${targetMessage}${parentMessage}.`;
}

function getUpdateCollectionLogMessage (entity: IUpdatable, parent: IUpdatable, prefix: string, join: string): string {
    const baseMessage = `${prefix} ${entity.type} ${entity.id}`;
    return parent ? `${baseMessage} ${join} ${parent.type} ${parent.id}.` : `${baseMessage}.`
}

function isEntityArray(entities: IUpdatable[], pristineEntities: IUpdatable[]): boolean {
    return (Array.isArray(entities) && isEntity(entities[0])) || (Array.isArray(pristineEntities) && isEntity(pristineEntities[0]));
}

function isEntity(entity: IUpdatable): boolean {
    return typeof entity?.type !== 'undefined' && typeof entity?.id !== 'undefined';
}

function getMatchingItems(current: any[], pristine: any[]): any[] {
    if (current.length === 0) {
        return [];
    }

    const matchedPristineItems = pristine.filter(e => current.find(p => propertyMatch(e, p)));
    return  current.filter(c => matchedPristineItems.find(i => propertyMatch(c, i)));
}

function getMissingItems(current: any[], pristine: any[]): any[] {
    if (current.length === 0) {
        return pristine;
    }

    return pristine.filter(e => !current.find(p => propertyMatch(e, p)));
}

function getItemName(item: any): string {
    const { first, second } = getKeyPropertyNames(item);
    return item[first] ?? item[second] ?? Object.keys(item)[0] ?? 'unknown';
}

function removeDeletedEntries(item: any) {
    if (typeof item === undefined) {
        return;
    }

    const properties = Object.keys(item);

    properties.forEach(p => {
        const value = item[p];

        if (Array.isArray(value)) {
            value.removeDeleted();

            value.forEach(e => {
                removeDeletedEntries(e);
            })
        } else if (typeof value === 'object') {
            removeDeletedEntries(value);
        }
    });
}