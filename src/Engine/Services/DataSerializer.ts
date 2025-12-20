import {IDataSerializer} from "storyScript/Interfaces/services/dataSerializer";
import {InitEntityCollection} from "storyScript/EntityCreatorFunctions";
import {StateProperties} from "storyScript/stateProperties.ts";
import {SerializationData} from "storyScript/Services/serializationData.ts";
import {getKeyPropertyNames, getPlural, isDataRecord} from "storyScript/utilityFunctions";
import {DescriptionProperty, IdProperty} from "../../../constants.ts";
import {parseFunction, serializeFunction} from "storyScript/Services/sharedFunctions.ts";

export class DataSerializer implements IDataSerializer {
    private conversationPropertiesToSerialize = [
        'actions',
        'startNode',
        'singleRepliesChosen'
    ]
    
    constructor(private readonly _pristineEntities: Record<string, Record<string, any>>) {
    }

    createSerializableClone = (original: any): any => {
        return this.buildStructureForSerialization(undefined, original, undefined);
    }

    restoreObjects = (
        loaded: any
    ): any => {
        for (const key in loaded) {
            if (!loaded.hasOwnProperty(key)) {
                continue;
            }

            const value = loaded[key];

            if (this.restoreArray(value, loaded, key)) {
                continue;
            }

            if (typeof value === 'object') {
                this.restoreObjects(value);
            } else if (typeof value === 'string' && value.indexOf('function') > -1) {
                loaded[key] = parseFunction(value);
            }
        }

        return loaded;
    }

    private readonly buildStructureForSerialization = (clone: any, original: any, pristine: any, parentKey?: string): any => {
        clone ??= this.createClone(original);

        if (clone == original) {
            return clone;
        }

        for (const key in original) {
            if (!original.hasOwnProperty(key)) {
                continue;
            }

            let originalValue = original[key];
            let pristineValue: any;

            if (original.type && original.id) {
                pristine = this._pristineEntities[getPlural(original.type)]?.[original.id];
            }

            pristineValue = pristine?.[key];

            // Do add NULL values to the clone for equipment, as these can be used as placeholders.
            // This is used by the engine to determine which equipment slots are available.
            if (originalValue === null) {
                if (parentKey === 'equipment') {
                    clone[key] = null;
                }
                
                continue;
            }

            if (this.skipProperty(original, originalValue, key, parentKey)) {
                continue;
            }
            
            let newValue = this.processArrayDeletedValuesAndProperties(originalValue);

            this.getClonedValue({
                clone: clone, 
                key: key, 
                original: original, 
                originalValue: newValue,
                pristine: pristine,
                pristineValue: pristineValue
            });
        }

        return clone;
    }
    
    private processArrayDeletedValuesAndProperties(originalValue: any, ): any {
        let newValue: any = originalValue;
        
        // Add deleted entries to the array. Create a new array for this to prevent changing
        // the one used at runtime. Also copy over additional properties that may be there,
        // except for the array of deleted entities. This is handled differently.
        if (Array.isArray(originalValue)) {
            const deletedEntries = originalValue.getDeleted();
            newValue = [...originalValue];
            deletedEntries.forEach(e => newValue.push(e));
            const additionalProperties = Object.keys(originalValue).filter(k => k !== '_deleted' && !newValue[k]);
            additionalProperties.forEach(p => {
                newValue[p] = originalValue[p];
            });
        }
        
        return newValue;
    }

    private readonly restoreArray = (value: any, loaded: any, key: string): boolean => {
        if (!Array.isArray(value)) {
            return false;
        }

        InitEntityCollection(loaded, key);
        this.restoreObjects(value);
        const entriesToDelete = value.filter(e => e?.[StateProperties.Deleted]);

        entriesToDelete.forEach(e => {
            value.delete(e);
        });

        const arrayPropertyKey = `${key}_arrProps`;
        const additionalArrayProperties = loaded[arrayPropertyKey];

        if (additionalArrayProperties) {
            Object.keys(additionalArrayProperties).forEach(k => {
                // Use a cast to any to suppress the warning that named properties should be used
                // with objects and numeric indexes with arrays.
                (<any>value)[k] = additionalArrayProperties[k];
            });

            delete loaded[arrayPropertyKey];
        }

        return true;
    }

    private readonly createClone = (values: any): any => {
        let clone: any;

        if (Array.isArray(values)) {
            clone = [];
        } else {
            clone = typeof values === 'object' ? {} : values;
        }

        return clone;
    }

    private readonly getClonedValue = (data: SerializationData): void => {
        if (this.processDataRecord(data)) {
            return;
        }

        if (this.processArray(data)) {
            return;
        }

        if (typeof data.originalValue === 'object') {
            if (Array.isArray(data.clone)) {
                data.clone.push({});
            } else {
                data.clone[data.key] = {};
            }

            const createdObject = data.clone[data.key];
            this.buildStructureForSerialization(createdObject, data.originalValue, data.pristineValue, data.key);

            // Do not include empty objects in the serialized data.
            if (!Array.isArray(data.clone) && typeof (createdObject) === 'object' && Object.keys(createdObject).length === 0) {
                delete data.clone[data.key];
            }

            return;
        }

        if (typeof data.originalValue === 'function') {
            if (!data.originalValue.isProxy && data.originalValue.toString() !== data.pristineValue?.toString()) {
                data.clone[data.key] = serializeFunction(data.originalValue);
            }
            return;
        }

        // Store only values that are different from the pristine value, values that are needed to create a
        // traversable world structure, and the key values of deleted array records.
        if (data.originalValue != data.pristineValue || this.isKeyProperty(data.pristine, data.key) || data.original[StateProperties.Deleted] === true) {
            data.clone[data.key] = data.originalValue;
        }
    }

    private readonly processDataRecord = (data: SerializationData): boolean => {
        if (!isDataRecord(data.originalValue)) {
            return false;
        }

        data.clone[data.key] = [];
        const record = data.clone[data.key];
        const match = data.pristine?.find((p: any[]) => p[0] === data.originalValue[0]);

        if (!match) {
            const value = data.originalValue[1];

            if (value[StateProperties.Deleted]) {
                record[0] = data.pristineValue[0];
                record[1] = {[StateProperties.Deleted]: true};
                return true;
            } else if (typeof value === 'function' && value[StateProperties.Added]) {
                record[0] = data.originalValue[0];
                record[1] = {'function': serializeFunction(value), [StateProperties.Added]: true};
                return true;
            }
        }

        record[0] = data.originalValue[0];

        this.getClonedValue(<SerializationData>{
            clone: data.clone[data.key],
            key: '1',
            original: data.originalValue,
            originalValue: data.originalValue[1],
            pristine: match,
            pristineValue: match?.[1]
        });

        // Delete empty objects from the record.
        if (record[1] && !Object.keys(record[1]).length) {
            record.splice(1, 1);
        }

        return true;
    }

    private readonly processArray = (data: SerializationData): boolean => {
        if (!Array.isArray(data.originalValue)) {
            return false;
        }

        // Do not include empty arrays in the serialized data when we have a pristine value to compare
        // to. Otherwise, keep empty arrays as they are needed to correctly reconstruct the object.
        if (data.pristine && !data.originalValue.length) {
            return false;
        }

        data.clone[data.key] = [];
        const resultArray = data.clone[data.key];
        this.buildStructureForSerialization(resultArray, data.originalValue, data.pristineValue);

        // Delete empty objects from the array. Only remove objects that have no properties or
        // only properties with no values.
        const emptyItems = resultArray.filter(e => {
            if (typeof e !== 'object') {
                return false;
            }
            return !Object.values(e).filter(v => v !== undefined && v !== null && v !== '').length;
        });
        emptyItems.forEach(e => resultArray.splice(resultArray.indexOf(e), 1));

        const additionalArrayProperties = Object.keys(data.originalValue).filter(v => {
            let isAdditionalProperty = isNaN(parseInt(v));

            if (isAdditionalProperty) {
                // add and delete proxies are used for location destinations, these are added in the LocationService.
                // Ignore these proxies.
                if (v === 'add' || v === 'delete') {
                    isAdditionalProperty = false;
                }
            }

            return isAdditionalProperty;
        });

        additionalArrayProperties.forEach(p => {
            const arrayPropertyKey = `${data.key}_arrProps`;
            data.clone[arrayPropertyKey] = data.clone[arrayPropertyKey] || {};
            this.getClonedValue({
                clone: data.clone[arrayPropertyKey],
                key: p,
                original: data.originalValue,
                originalValue: data.originalValue[p],
                pristine: data.pristine,
                pristineValue: data.pristineValue
            });
        });

        return true;
    }

    private readonly skipProperty = (original: any, originalValue: any, key: string, parentKey: string): boolean => {
        return (
            originalValue === undefined
            || originalValue.isProxy
            // Exclude descriptions and conversation nodes from the save data, these are not present on the pristine data.
            // Use an additional property to identify them, as their names are quite generic.
            || (original[IdProperty] && (key === DescriptionProperty || key === 'descriptions'))
            || (parentKey === 'conversation' && !this.conversationPropertiesToSerialize.includes(key))
        );
    }
    
    private readonly isKeyProperty = (item: any, propertyName: string): boolean => {
        const keyProperties = getKeyPropertyNames(item);
        return keyProperties.first === propertyName || keyProperties.second === propertyName;
    }
}