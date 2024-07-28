import {IDataSerializer} from "storyScript/Interfaces/services/dataSerializer";
import {initCollection} from "storyScript/ObjectConstructors";
import {parseFunction, serializeFunction} from "storyScript/globals";
import {StateProperties} from "storyScript/stateProperties.ts";
import {SerializationData} from "storyScript/Services/serializationData.ts";
import {getPlural, isDataRecord, isKeyProperty} from "storyScript/utilities";
import {
    FunctionType,
    ObjectType,
    StringType,
    IdProperty,
    StartNodeProperty
} from "../../../constants.ts";

export class DataSerializer implements IDataSerializer {
    constructor(private _pristineEntities: Record<string, Record<string, any>>) {
    }
    
    createSerializableClone = (original: any, clone?: any): any => {
        return this.buildStructureForSerialization(original, clone, undefined);
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

            if (typeof value === ObjectType) {
                this.restoreObjects(value);
            } else if (typeof value === StringType && value.indexOf('function') > -1) {
                loaded[key] = parseFunction(value);
            }
        }

        return loaded;
    }

    private buildStructureForSerialization = (original: any, clone: any, pristine: any): any => {
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

            // Do add NULL values to the clone, as these can be used as placeholders. This is used by the engine to determine
            // which equipment slots are available.
            if (originalValue === null) {
                clone[key] = null;
                continue;
            }

            if (this.skipProperty(original, originalValue, key)) {
                continue;
            }

            if (Array.isArray(originalValue)) {
                originalValue = original[key].withDeleted();
            }

            this.getClonedValue({clone, key, original, originalValue, pristine, pristineValue});
        }

        return clone;
    }
    
    private restoreArray = (value: any, loaded: any, key: string): boolean => {
        if (!Array.isArray(value)) {
            return false;
        }

        initCollection(loaded, key, true);
        this.restoreObjects(value);

        const entriesToDelete = value.filter(e => e?.[StateProperties.Deleted]);

        entriesToDelete.forEach(e => {
            value.delete(e);
        });

        const arrayPropertyKey = `${key}_arrProps`;
        const additionalArrayProperties = loaded[arrayPropertyKey];

        if (additionalArrayProperties) {
            Object.keys(additionalArrayProperties).forEach(k => {
                loaded[k] = additionalArrayProperties[k];
            });

            delete loaded[arrayPropertyKey];
        }

        return true;
    }

    private createClone = (values: any): any => {
        let clone: any;

        if (Array.isArray(values)) {
            clone = [];
        } else {
            clone = typeof values === ObjectType ? {} : values;
        }

        return clone;
    }

    private skipProperty = (original: any, originalValue: any, key: string): boolean => {
        return (
            originalValue === undefined
            || originalValue.isProxy
            // Exclude descriptions and conversation nodes from the save data, these are not present on the pristine data.
            // Use an additional property to identify them, as their names are quite generic.
            || (original[IdProperty] && (key === 'description' || key === 'descriptions'))
            || original[StartNodeProperty] && key === 'nodes'
        );
    }

    private getClonedValue = (data: SerializationData): void => {
        if (this.processDataRecord(data)) {
            return;
        }

        if (this.processArray(data)) {
            return;
        }

        if (typeof data.originalValue === ObjectType) {
            if (Array.isArray(data.clone)) {
                data.clone.push({});
            } else {
                data.clone[data.key] = {};
            }

            this.buildStructureForSerialization(data.originalValue, data.clone[data.key], data.pristineValue);
            return;
        }
        
        if (typeof data.originalValue === FunctionType) {
            if (!data.originalValue.isProxy && data.originalValue.toString() !== data.pristineValue?.toString()) {
                data.clone[data.key] = serializeFunction(data.originalValue);
            }
            return;
        }

        // Store only values that are different from the pristine value, values that are needed to create a
        // traversable world structure, and the key values of deleted array records.
        if (data.originalValue != data.pristineValue || isKeyProperty(data.pristine, data.key) || data.original[StateProperties.Deleted] === true) {
            data.clone[data.key] = data.originalValue;
        }
    }

    private processDataRecord = (data: SerializationData): boolean => {
        if (!isDataRecord(data.originalValue)) {
            return false;
        }

        data.clone[data.key] = [];
        const match = data.pristine?.find((p: any[]) => p[0] === data.originalValue[0]);

        if (!match && data.originalValue[StateProperties.Deleted]) {
            data.clone[data.key][0] = data.pristineValue[0];
            data.clone[data.key][StateProperties.Deleted] = true;
            return true;
        }

        data.clone[data.key][0] = data.originalValue[0];

        this.getClonedValue(<SerializationData>{
            clone: data.clone[data.key],
            key: '1',
            original: data.originalValue,
            originalValue: data.originalValue[1],
            pristine: match,
            pristineValue: match?.[1]
        });

        return true;
    }

    private processArray = (data: SerializationData): boolean => {
        if (!Array.isArray(data.originalValue)) {
            return false;
        }

        data.clone[data.key] = [];
        this.buildStructureForSerialization(data.originalValue, data.clone[data.key], data.pristineValue);

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
}