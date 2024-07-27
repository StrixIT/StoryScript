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
import {IEntity} from "storyScript/Interfaces/entity.ts";

export class DataSerializer implements IDataSerializer {

    buildClone = (original: any, pristineValues: Record<string, Record<string, any>>, clone?: any): any => {
        return this.buildStructureForSerialization(original, clone, undefined, pristineValues);
    }
    
    buildStructureForSerialization = (original: any, clone: any, pristine: any, pristineValues: Record<string, Record<string, any>>): any => {
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
                 pristine = pristineValues[getPlural(original.type)]?.[original.id];
             }

             pristineValue =  pristine?.[key];

            // Do add NULL values to the clone, as these can be used as placeholders. This is used by the engine to determine
            // which equipment slots are available.
            if (originalValue === null) {
                clone[key] = null;
                continue;
            }
            
            if (
                originalValue === undefined
                || originalValue.isProxy
                // Exclude descriptions and conversation nodes from the save data, these are not present on the pristine data.
                // Use an additional property to identify them, as their names are quite generic.
                || (original[IdProperty] && (key === RuntimeProperties.Description || key === RuntimeProperties.Descriptions))
                || original[StartNodeProperty] && key === RuntimeProperties.Nodes
            ) {
                continue;
            }

            if (Array.isArray(originalValue)) {
                originalValue = original[key].withDeleted();
            }
            
            this.getClonedValue(clone, key, original, originalValue, pristine, pristineValue, pristineValues);
        }
    
        return clone;
    }
    
    createClone = (values: any): any => {
        let clone: any;
        
        if (Array.isArray(values))
        {
            clone = [];
        }
        else
        {
            clone = typeof values === ObjectType ? {} : values;
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
                
                const entriesToDelete = value.filter(e => e[RuntimeProperties.Deleted]);
                
                entriesToDelete.forEach(e =>{
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

    private getClonedValue = (clone: any, key: string, original: any, value: any, pristine: any, pristineValue: any, pristineValues: Record<string, Record<string, IEntity>>): void => {
        if (isDataRecord(value))
        {
            clone[key] = [];
            const match = pristine?.find(p => p[0] === value[0]);
            
            if (!match && value[RuntimeProperties.Deleted]) {
                clone[key][0] = pristineValue[0];
                clone[key][RuntimeProperties.Deleted] = true;
                return;
            }
            
            clone[key][0] = value[0];
            this.getClonedValue(clone[key], '1', value, value[1], match, match?.[1], pristineValues);
            return;
        }
        
        if (Array.isArray(value)) {
            clone[key] = [];
            this.buildStructureForSerialization(value, clone[key], pristineValue, pristineValues);
    
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
                this.getClonedValue(clone[arrayPropertyKey], p, value[p], false, pristine, pristineValue, pristineValues);
            });
        }
        else if (typeof value === ObjectType) {
            if (Array.isArray(clone)) {
                clone.push({});
            }
            else {
                clone[key] = {};
            }
    
            this.buildStructureForSerialization(value, clone[key], pristineValue, pristineValues);
        }
        else if (typeof value === FunctionType) {
            this.getClonedFunction(clone, value, pristineValue, key);
        }
        // Store only values that are different from the pristine value, values that are needed to create a
        // traversable world structure, and the key values of deleted array records.
        else if (value != pristineValue || isKeyProperty(pristine, key) || original[RuntimeProperties.Deleted] === true) {
            clone[key] = value;
        }
    }
    
    private getClonedFunction = (clone: any, value: any, pristineValue: any, key: string): void => {
        if (!value.isProxy) {
            if (value.functionId) {
                if (!pristineValue) {
                    var test = 0;
                }
                
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