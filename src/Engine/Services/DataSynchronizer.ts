import {IEntity} from "storyScript/Interfaces/entity.ts";
import {IDataSynchronizer} from "storyScript/Interfaces/services/dataSynchronizer";
import {RuntimeProperties} from "storyScript/runtimeProperties";
import {getKeyPropertyNames, getPlural, isDataRecord, propertyMatch} from "storyScript/utilities";
import {FunctionType, UndefinedType} from "../../../constants.ts";

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

        if (typeof pristineEntity === UndefinedType && this.isEntity(entity)) {
            pristineEntity = this._pristineEntities[getPlural(entity.type)][entity.id];
        }

        let propertyNames = (pristineEntity && Object.keys(pristineEntity)) ?? (entity && Object.keys(entity)) ?? [];

        propertyNames.forEach(p => {
            let currentProperty = entity[p];

            // If there is no pristine entity, recurse down the object to find entities to synchronize.
            if (typeof pristineEntity === UndefinedType) {
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
                return;
            }

            this.updatePropertyValue(p, entity, parentEntity, pristineProperty);
        });
    }

    private updateDataRecord = (entity: any, pristineEntity: any): boolean => {
        if (!isDataRecord(pristineEntity?.[0] ?? [])) {
            return false;
        }

        pristineEntity.forEach((p: any[]) => {
            const match = entity.find((e: any[]) => e[0] === p[0]);

            if (!match || match[RuntimeProperties.Deleted]) {
                return;
            } else if (typeof (p[1]) === FunctionType) {
                match[1] = p[1];
            } else {
                this.synchronizeEntityData(match[1], p[1], entity, pristineEntity, '1');
            }
        });

        this.markEntriesAsDeleted(entity);
        return true;
    }

    private updateArray(
        entity: any[],
        pristineEntity: any[],
        parentEntity?: IEntity,
        pristineParentEntity?: IEntity,
        parentProperty?: string
    ): boolean {
        if (!Array.isArray(entity) || !Array.isArray(pristineEntity) || (entity.length == 0 && pristineEntity.length == 0)) {
            return false;
        }

        const existingItems = entity.filter(e => e[RuntimeProperties.Added] && !pristineEntity.find(p => propertyMatch(e, p)));
        const matchedItems = pristineEntity.filter(e => entity.find(p => propertyMatch(e, p)));
        const itemsToAdd = pristineEntity.filter(e => !entity.find(p => propertyMatch(e, p)));

        existingItems.concat(matchedItems).forEach(i => {
            const currentValue: any = entity.find(p => propertyMatch(i, p));

            // In case of an entity with the 'added' flag, 'i' is a skeleton value. Set the pristine entity to 'undefined' 
            // so it will be looked up again later on.
            const pristineValue = i[RuntimeProperties.Added] && this.isEntity(i) ? undefined : i;

            if (!currentValue[RuntimeProperties.Deleted]) {
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

    private updatePropertyValue = (
        propertyName: string,
        entity: any,
        parentEntity: any,
        pristineProperty: any,
    ) => {
        const currentValue = entity[propertyName];

        if (currentValue !== pristineProperty) {
            if (typeof currentValue === FunctionType && typeof pristineProperty === FunctionType && currentValue.toString() === pristineProperty.toString()) {
                console.log(`Property ${propertyName} on ${this.getItemName(entity) ?? this.getItemName(parentEntity)} is a non-modified function`);
                return;
            }

            console.log(`Property ${propertyName} on ${this.getItemName(entity) ?? this.getItemName(parentEntity)} was modified. It's value of '${currentValue}' is retained.`);
        }
    }

    private isEntity = (entity: IEntity): boolean => {
        return typeof entity?.type !== 'undefined' && typeof entity?.id !== 'undefined';
    }

    private markEntriesAsDeleted = (item: any[]) => {
        const itemsToDelete = item.filter(i => i[RuntimeProperties.Deleted]);
        itemsToDelete.forEach(i => item.delete(i));
    }

    private getItemName = (item: any): string => {
        const {first, second} = getKeyPropertyNames(item);
        return item[first] ?? item[second] ?? Object.keys(item)[0] ?? 'unknown';
    }
}