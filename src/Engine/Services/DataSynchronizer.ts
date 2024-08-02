import {IDataSynchronizer} from "storyScript/Interfaces/services/dataSynchronizer";
import {StateProperties} from "storyScript/stateProperties.ts";
import {getPlural, isDataRecord, propertyMatch} from "storyScript/utilityFunctions";
import {InitEntityCollection, setReadOnlyLocationProperties} from "storyScript/EntityCreatorFunctions.ts";

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

        if (this.isEntity(entity)) {
            if (typeof pristineEntity === 'undefined') {
                pristineEntity = this._pristineEntities[getPlural(entity.type)][entity.id];
            }
            else if (entity.type === 'location') {
                setReadOnlyLocationProperties(entity);
            }
        }

        let propertyNames = (pristineEntity && Object.keys(pristineEntity)) ?? (entity && Object.keys(entity)) ?? [];

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

            if (Array.isArray(pristineProperty) || typeof pristineProperty === 'object') {
                this.synchronizeEntityData(currentProperty, pristineProperty, entity, pristineEntity, p);
            }
            
            // Either the property is the same on the entity and the pristine entity (a key value)
            // or the value was changed at runtime. Either way, do nothing.
        });
    }

    private updateDataRecord = (entity: any, pristineEntity: any): boolean => {
        if (!isDataRecord(pristineEntity?.[0] ?? [])) {
            return false;
        }

        pristineEntity.forEach((p: any[]) => {
            const match = entity.find((e: any[]) => e[0] === p[0]);

            if (!match || match[StateProperties.Deleted]) {
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

        if ((entity.length == 0 && pristineEntity.length == 0)) {
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
            const pristineValue = i[StateProperties.Added] && this.isEntity(i) ? undefined : i;

            if (!currentValue[StateProperties.Deleted]) {
                this.synchronizeEntityData(currentValue, pristineValue, parentEntity, pristineParentEntity, parentProperty);
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

    private isEntity = (entity: any): boolean => {
        return typeof entity?.type !== 'undefined' && typeof entity?.id !== 'undefined';
    }

    private markEntriesAsDeleted = (item: any[]) => {
        const itemsToDelete = item.filter(i => i[StateProperties.Deleted]);
        itemsToDelete.forEach(i => item.delete(i));
    }
}