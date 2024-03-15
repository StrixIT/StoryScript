import { IDataSerializer } from "storyScript/Interfaces/services/dataSerializer";
import { IFunctionIdParts } from "storyScript/Interfaces/services/functionIdParts";
import { GetDescriptions, initCollection } from "storyScript/ObjectConstructors";
import { parseFunction } from "storyScript/globals";
import { RuntimeProperties } from "storyScript/runtimeProperties";
import { getId, getPlural } from "storyScript/utilities";

export class DataSerializer implements IDataSerializer {

    private _functionArgumentRegex = /\([a-z-A-Z0-9:, ]{1,}\)/;

    buildClone = (parentKey: string, values, pristineValues, clone?): any => {
        if (!clone) {
            clone = Array.isArray(values) ? [] : typeof values === 'object' ? {} : values;
            if (clone == values) {
                return clone;
            }
        }
    
        for (var key in values) {
            if (!values.hasOwnProperty(key)) {
                continue;
            }
    
            var value = values[key];
    
            if (Array.isArray(value)) {
                value = (<any>values[key]).withDeleted();
            }
    
            if (value === undefined) {
                continue;
            }
            else if (value === null) {
                clone[key] = null;
                continue;
            }
            else if (value.isProxy) {
                continue;
            }
            // Exclude descriptions and conversation nodes from the save data so they
            // are refreshed on every browser refresh.
            else if (values.id && (key === RuntimeProperties.Description || key === RuntimeProperties.Descriptions)) {
                clone[key] = null;
                continue;
            }
            else if (parentKey === 'conversation' && key === RuntimeProperties.Nodes) {
                clone[key] = null;
                continue;
            }
    
            this.getClonedValue(clone, value, key, pristineValues);
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
    
            var value = loaded[key];
    
            if (value === undefined) {
                continue;
            }
            else if (Array.isArray(value)) {
                initCollection(loaded, key, true);
                this.restoreObjects(functionList, descriptions, value);
    
                var arrayPropertyKey = `${key}_arrProps`;
                var additionalArrayProperties = loaded[arrayPropertyKey];
    
                if (additionalArrayProperties) {
                    Object.keys(additionalArrayProperties).forEach(k => {
                        loaded[k] = additionalArrayProperties[k];
                    });
    
                    delete loaded[arrayPropertyKey];
                }
            }
            else if (typeof value === 'object') {
                this.restoreObjects(functionList, descriptions, value);
            }
            else if (typeof value === 'string') {
                this.restoreFunction(functionList, loaded, value, key);
            }
        }
    
        return loaded;
    }

    private getClonedValue = (clone: any, value: any, key: string, pristineValues: any): void => {
        var pristineValue = pristineValues && pristineValues.hasOwnProperty(key) ? pristineValues[key] : undefined;
    
        if (Array.isArray(value)) {
            clone[key] = [];
            this.buildClone(key, value, pristineValue, clone[key]);
    
            var additionalArrayProperties = Object.keys(value).filter(v => {
                var isAdditionalProperty = isNaN(parseInt(v));
    
                if (isAdditionalProperty) {
                    if (v === 'push' || (value[v].name === 'push') && value[v].isProxy) {
                        isAdditionalProperty = false;
                    }
                }
    
                return isAdditionalProperty;
            });
    
            additionalArrayProperties.forEach(p => {
                var arrayPropertyKey = `${key}_arrProps`;
                clone[arrayPropertyKey] = clone[arrayPropertyKey] || {};
                this.getClonedValue(clone[arrayPropertyKey], value[p], p, pristineValue);
            });
        }
        else if (typeof value === 'object') {
            if (Array.isArray(clone)) {
                clone.push({});
            }
            else {
                clone[key] = {};
            }
    
            this.buildClone(key, value, pristineValue, clone[key]);
        }
        else if (typeof value === 'function') {
            this.getClonedFunction(clone, value, key);
        }
        else {
            clone[key] = value;
        }
    }
    
    private getClonedFunction = (clone: any, value: any, key: string): void => {
        if (!value.isProxy) {
            if (value.functionId) {
                clone[key] = value.functionId;
            } else if (key === 'target') {
                clone[key] = getId(value);
            }
            else {
                // Functions added during runtime must be serialized using the function() notation in order to be deserialized back
                // to a function. Convert values that have an arrow notation.
                let functionString = value.toString();
    
                if (functionString.indexOf('function') == -1) {
                    var arrowIndex = functionString.indexOf('=>');
    
                    // The arguments regex will fail when no arguments are used in production mode. Use empty brackets in that case.
                    var args = functionString.match(this._functionArgumentRegex)?.[0] || '()';
    
                    functionString = 'function' + args + functionString.substring(arrowIndex + 2).trim();
                }
    
                clone[key] = functionString;
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
            var parts = this.GetFunctionIdParts(value);
            var type = getPlural(parts.type);
            var typeList = functionList[type];
    
            if (!typeList[parts.functionId]) {
                console.log('Function with key: ' + parts.functionId + ' could not be found!');
                return;
            }
            else if (typeList[parts.functionId].hash != parts.hash) {
                console.warn(`Function with key: ${parts.functionId} was found but the hash does not match the stored hash (old hash: ${parts.hash}, new hash: ${typeList[parts.functionId].hash})! Did you change the order of actions in an array and/or change the function content? If you changed the order, you need to reset the game world. If you changed only the content, you can ignore this warning.`);
            }
    
            loaded[key] = typeList[parts.functionId].function;
        }
        else if (typeof value === 'string' && value.indexOf('function') > -1) {
            loaded[key] = parseFunction(value);
        }
    }
    
    private GetFunctionIdParts = (value: string): IFunctionIdParts => {
        var parts = value.split('#');
        var functionPart = parts[1];
        var functionParts = functionPart.split('|');
        var type = functionParts[0];
        functionParts.splice(0, 1);
        var functionId = functionParts.join('|');
        var hash = parseInt(parts[2]);
    
        return {
            type: type,
            functionId: functionId,
            hash: hash
        }
    }
    
}