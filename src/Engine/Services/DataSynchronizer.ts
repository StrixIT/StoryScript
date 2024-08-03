import {IDataSynchronizer} from "storyScript/Interfaces/services/dataSynchronizer";
import {StateProperties} from "storyScript/stateProperties.ts";
import {getPlural, isDataRecord, propertyMatch} from "storyScript/utilityFunctions";
import {InitEntityCollection, setReadOnlyLocationProperties} from "storyScript/EntityCreatorFunctions.ts";
import {isEntity} from "storyScript/Services/sharedFunctions.ts";

export class DataSynchronizer implements IDataSynchronizer {
    constructor(private _pristineEntities: Record<string, Record<string, any>>) {
    }

    synchronizeEntityData = (
        entity: any,
        pristineEntity?: any,
        parentEntity?: any,
        pristineParentEntity?: any,
        parentProperty?: string
    ): void => {
        if (this.updateDataRecord(entity, pristineEntity)) {
            return;
        }

        if (this.updateArray(entity, pristineEntity, parentEntity, pristineParentEntity, parentProperty)) {
            return;
        }

        if (isEntity(entity)) {
            if (typeof pristineEntity === 'undefined') {
                pristineEntity = this._pristineEntities[getPlural(entity.type)][entity.id];
            }
            
            if (entity.type === 'location') {
                setReadOnlyLocationProperties(entity);
            }
        }

        let propertyNames = 
            ((pristineEntity && Object.keys(pristineEntity)) ?? [])
            .concat((entity && Object.keys(entity)) ?? []);

        propertyNames.forEach(p => {
            let currentProperty = entity[p];

            // If there is no pristine entity, recurse down the object to find entities to synchronize.
            if (typeof pristineEntity === 'undefined') {
                if (Array.isArray(currentProperty) || typeof currentProperty === 'object') {
                    this.synchronizeEntityData(currentProperty, undefined, entity, pristineEntity, p);
                }
                return;
            }

            let pristineProperty = pristineEntity[p];
            
            if (typeof currentProperty === 'undefined') {
                if (Array.isArray(pristineProperty)) {
                    entity[p] = [];
                } else if (typeof pristineProperty === 'object') {
                    entity[p] = {};
                } else {
                    // If there is no value for this property on the object yet, 
                    // it wasn't changed during runtime. Set it now.
                    entity[p] = pristineProperty;
                    return;
                }
            }

            currentProperty = entity[p];

            if (typeof pristineProperty === 'undefined') {
                if (Array.isArray(currentProperty)) {
                    pristineProperty = [];
                }
                else if (typeof currentProperty === 'object') {
                    pristineProperty = {};
                }
            }
            
            if (Array.isArray(pristineProperty) || typeof pristineProperty === 'object') {
                this.synchronizeEntityData(currentProperty, pristineProperty, entity, pristineEntity, p);
            }
            
            // Either the property is the same on the entity and the pristine entity (a key value)
            // or the value was changed at runtime. Either way, do nothing.
        });
    }

    private updateDataRecord = (entity: any, pristineEntity: any): boolean => {
        if (!isDataRecord(pristineEntity?.[0]) && !isDataRecord(entity?.[0])) {
            return false;
        }

        pristineEntity.forEach((p: any[]) => {
            const match = entity.concat(entity.getDeleted()).find((e: any[]) => e[0] === p[0]);

            if (!match) {
                // If there is no match, it means the record was added during design-time.
                // Add it to the entity as well.
                entity.push(p);
            }
            else if (match[StateProperties.Deleted]) {
                return;
            } else if (typeof (p[1]) === 'function') {
                match[1] = p[1];
            } else {
                if (!match[1]) {
                    match.push({});
                }

                this.synchronizeEntityData(match[1], p[1], entity, pristineEntity, '1');
            }
        });

        const newRecords = entity.filter((e: any[]) => !pristineEntity.find(p => p[0] === e[0]));
        const recordsToRemove = newRecords.filter((e: any[]) => !e[1]?.[StateProperties.Added]);
        recordsToRemove.forEach(r => entity.splice(entity.indexOf(r), 1));
        const recordsToKeep = newRecords.filter((e: any[]) => e[1]?.[StateProperties.Added]);
        recordsToKeep.forEach(r => {
            if (r[1].function) {
                r[1] = r[1].function;
                r[1][StateProperties.Added] = true;
            }
        })
        
        this.markEntriesAsDeleted(entity);
        return true;
    }

    private updateArray(
        entity: any[],
        pristineEntity: any[],
        parentEntity?: any,
        pristineParentEntity?: any,
        parentProperty?: string
    ): boolean {
        if (!Array.isArray(entity) || !Array.isArray(pristineEntity)) {
            return false;
        }

        if (entity.length == 0 && pristineEntity.length == 0 && isEntity[parentEntity[parentProperty]]) {
            // Empty arrays weren't included in the serialized data. Call InitEntityCollection
            // on them now to properly restore entities.
            InitEntityCollection(parentEntity, parentProperty);
            return true;
        }

        const existingItems = entity.filter(e => e[StateProperties.Added] && !pristineEntity.find(p => propertyMatch(e, p)));
        const matchedItems = pristineEntity.filter(e => entity.find(p => propertyMatch(e, p)));
        const itemsToAdd = pristineEntity.filter(e => !entity.concat(entity.getDeleted()).find(p => propertyMatch(e, p)));

        existingItems.concat(matchedItems).forEach(i => {
            const currentValue: any = entity.find(p => propertyMatch(i, p));

            // In case of an entity with the 'added' flag, 'i' is a skeleton value. Set the pristine entity to 'undefined' 
            // so it will be looked up again later on.
            const pristineValue = i[StateProperties.Added] && isEntity(i) ? undefined : i;

            if (!currentValue[StateProperties.Deleted]) {
                this.synchronizeEntityData(currentValue, pristineValue, parentEntity, pristineParentEntity, parentProperty);
            }

            itemsToAdd.splice(0, 0, currentValue);
        });

        entity.length = 0;
        itemsToAdd.forEach(i => {
            entity.push(i);
        });

        this.markEntriesAsDeleted(entity);
        return true;
    }

    private markEntriesAsDeleted = (item: any[]) => {
        const itemsToDelete = item.filter(i => i[StateProperties.Deleted]);
        itemsToDelete.forEach(i => item.delete(i));
    }
}