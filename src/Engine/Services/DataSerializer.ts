import { IDataSerializer } from "storyScript/Interfaces/services/dataSerializer";
import { IFunctionIdParts } from "storyScript/Interfaces/services/functionIdParts";
import { GetDescriptions, initCollection } from "storyScript/ObjectConstructors";
import { parseFunction, serializeFunction } from "storyScript/globals";
import { RuntimeProperties } from "storyScript/runtimeProperties";
import {getPlural, isDataRecord, isKeyProperty} from "storyScript/utilities";
import {
    FunctionType,
    ObjectType,
    StringType,
    IdProperty,
    StartNodeProperty
} from "../../../constants.ts";

export class DataSerializer implements IDataSerializer {

    buildClone = (values, pristineValues, clone?): any => {
        if (!clone) {
            if (Array.isArray(values))
            {
                clone = [];
            }
            else
            {
                clone = typeof values === ObjectType ? {} : values;
            }
            
            if (clone == values) {
                return clone;
            }
        }
    
        for (const key in values) {
            if (!values.hasOwnProperty(key)) {
                continue;
            }
    
            let value = values[key];

            // Do add NULL values to the clone, as these can be used as placeholders. This is used by the engine to determine
            // which equipment slots are available.
            if (value === null) {
                clone[key] = null;
                continue;
            }
            
            if (
                value === undefined
                || value.isProxy
                // Exclude descriptions and conversation nodes from the save data, these are not present on the pristine data.
                // Use an additional property to identify them, as their names are quite generic.
                || (values[IdProperty] && (key === RuntimeProperties.Description || key === RuntimeProperties.Descriptions))
                || values[StartNodeProperty] && key === RuntimeProperties.Nodes
            ) {
                continue;
            }

            if (Array.isArray(value)) {
                value = values[key].withDeleted();
            }
            
            this.getClonedValue(clone, value, key, values, pristineValues);
        }
    
        return clone;
    }
    
    restoreObjects = (
        functionList: { [type: string]: { [id: string]: { function: Function, hash: number } } }, 
        descriptions: Map<string, string>,
        loaded: any
    ): any => {
        descriptions = descriptions || GetDescriptions();
    
        for (const key in loaded) {
            if (!loaded.hasOwnProperty(key)) {
                continue;
            }
    
            const value = loaded[key];
    
            if (Array.isArray(value)) {
                initCollection(loaded, key, true);
                this.restoreObjects(functionList, descriptions, value);
    
                const arrayPropertyKey = `${key}_arrProps`;
                const additionalArrayProperties = loaded[arrayPropertyKey];
    
                if (additionalArrayProperties) {
                    Object.keys(additionalArrayProperties).forEach(k => {
                        loaded[k] = additionalArrayProperties[k];
                    });
    
                    delete loaded[arrayPropertyKey];
                }
            }
            else if (typeof value === ObjectType) {
                this.restoreObjects(functionList, descriptions, value);
            }
            else if (typeof value === StringType) {
                this.restoreFunction(functionList, loaded, value, key);
            }
        }
    
        return loaded;
    }

    private getClonedValue = (clone: any, value: any, key: string, values: any, pristineValues: any): void => {
        if (isDataRecord(value))
        {
            clone[key] = [];
            const match = pristineValues.find(p => p[key] === value[key]);
            clone[key][0] = value[0];
            this.getClonedValue(clone[key], value[1], '1', value, match);
            return;
        }
        
        const pristineValue = pristineValues?.hasOwnProperty(key) ? pristineValues[key] : undefined;
    
        if (Array.isArray(value)) {
            clone[key] = [];
            this.buildClone(value, pristineValue, clone[key]);
    
            const additionalArrayProperties = Object.keys(value).filter(v => {
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
                const arrayPropertyKey = `${key}_arrProps`;
                clone[arrayPropertyKey] = clone[arrayPropertyKey] || {};
                this.getClonedValue(clone[arrayPropertyKey], value[p], p, pristineValue, false);
            });
        }
        else if (typeof value === ObjectType) {
            if (Array.isArray(clone)) {
                clone.push({});
            }
            else {
                clone[key] = {};
            }
    
            this.buildClone(value, pristineValue, clone[key]);
        }
        else if (typeof value === FunctionType) {
            this.getClonedFunction(clone, value, pristineValue, key);
        }
        // Store only values that are different from the pristine value, values that are needed to create a
        // traversable world structure, and the key values of deleted array records.
        else if (value != pristineValue || isKeyProperty(pristineValues, key) || values[RuntimeProperties.Deleted] === true) {
            clone[key] = value;
        }
    }
    
    private getClonedFunction = (clone: any, value: any, pristineValue: any, key: string): void => {
        if (!value.isProxy) {
            if (value.functionId) {
                if (value.functionId !== pristineValue.functionId) {
                    clone[key] = value.functionId;
                }
            }
            else {
                clone[key] = serializeFunction(value);
            }
        }
    }
    
    private restoreFunction = (
        functionList: { [type: string]: { [id: string]: { function: Function, hash: number } } }, 
        loaded: any, 
        value: any, 
        key: string
    ): void => {
        if (value.indexOf('function#') > -1) {
            const parts = this.GetFunctionIdParts(value);
            const type = getPlural(parts.type);
            const typeList = functionList[type];
    
            if (!typeList[parts.functionId]) {
                console.log('Function with key: ' + parts.functionId + ' could not be found!');
                return;
            }
            else if (typeList[parts.functionId].hash != parts.hash) {
                console.warn(`Function with key: ${parts.functionId} was found but the hash does not match the stored hash (old hash: ${parts.hash}, new hash: ${typeList[parts.functionId].hash})! Did you change the order of actions in an array and/or change the function content? If you changed the order, you need to reset the game world. If you changed only the content, you can ignore this warning.`);
            }
    
            loaded[key] = typeList[parts.functionId].function;
        }
        else if (typeof value === StringType && value.indexOf('function') > -1) {
            loaded[key] = parseFunction(value);
        }
    }
    
    private GetFunctionIdParts = (value: string): IFunctionIdParts => {
        const parts = value.split('#');
        const functionPart = parts[1];
        const functionParts = functionPart.split('|');
        const type = functionParts[0];
        functionParts.splice(0, 1);
        const functionId = functionParts.join('|');
        const hash = parseInt(parts[2]);
    
        return {
            type: type,
            functionId: functionId,
            hash: hash
        }
    }
    
}