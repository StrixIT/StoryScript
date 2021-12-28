import { IFunctionIdParts } from '../Interfaces/services/functionIdParts';
import { DataKeys } from '../DataKeys';
import { getPlural, isEmpty } from '../utilities';
import { initCollection, setReadOnlyProperties, GetFunctions, GetDescriptions } from '../ObjectConstructors';
import { parseFunction } from '../globals';
import { IDataService } from '../Interfaces/services/dataService';
import { ILocalStorageService } from '../Interfaces/services/localStorageService';

export class DataService implements IDataService {
    private functionArgumentRegex = /\([a-z-A-Z0-9:, ]{1,}\)/;

    constructor(private _localStorageService: ILocalStorageService, private _gameNameSpace: string) {
    }
    
    save = <T>(key: string, value: T, pristineValues?: T): void => {
        var clone = this.buildClone(null, value, pristineValues);
        this._localStorageService.set(this._gameNameSpace + '_' + key, JSON.stringify({ data: clone }));
    }

    load = <T>(key: string): T => {
        try {
            var jsonData = this._localStorageService.get(this._gameNameSpace + '_' + key);

            if (jsonData) {
                var data = JSON.parse(jsonData).data;

                if (isEmpty(data)) {
                    return null;
                }

                var functionList = GetFunctions();
                this.restoreObjects(functionList, null, data);
                setReadOnlyProperties(key, data);
                return data;
            }

            return null;
        }
        catch (exception: any) {
            console.log('No data loaded for key ' + key + '. Error: ' + exception.message);
        }

        return null;
    }

    remove = (key: string): void => {
        this._localStorageService.remove(this._gameNameSpace + '_' + key);
    }

    copy = <T>(value: T, pristineValue: T): T => {
        return this.buildClone(null, value, pristineValue);
    }

    getSaveKeys = (): string[] => this._localStorageService.getKeys(this._gameNameSpace + '_' + DataKeys.GAME + '_');

    private buildClone = (parentKey: string, values, pristineValues, clone?): any => {
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
            else if (values.id && (key === 'description' || key === 'descriptions')) {
                clone[key] = null;
                continue;
            }
            else if (parentKey === 'conversation' && key === 'nodes') {
                clone[key] = null;
                continue;
            }

            this.getClonedValue(clone, value, key, pristineValues);
        }

        return clone;
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
            }
            else {
                // Functions added during runtime must be serialized using the function() notation in order to be deserialized back
                // to a function. Convert values that have an arrow notation.
                let functionString = value.toString();

                if (functionString.indexOf('function') == -1) {
                    var arrowIndex = functionString.indexOf('=>');

                    // The arguments regex will fail when no arguments are used in production mode. Use empty brackets in that case.
                    var args = functionString.match(this.functionArgumentRegex)?.[0] || '()';

                    functionString = 'function' + args + functionString.substring(arrowIndex + 2).trim();
                }

                clone[key] = functionString;
            }
        }
    }

    private restoreObjects = (functionList: { [type: string]: { [id: string]: { function: Function, hash: number } } }, descriptions: Map<string, string>, loaded): void => {
        descriptions = descriptions || GetDescriptions();
        
        for (var key in loaded) {
            if (!loaded.hasOwnProperty(key)) {
                continue;
            }

            if (key === 'description' && loaded.id) {
                var descriptionKey = `${loaded.type}_${loaded.id}`;
                loaded[key] = descriptions.get(descriptionKey);
                this.loadPictureFromDescription(loaded, key);
                continue;
            }

            var value = loaded[key];

            if (value === undefined) {
                continue;
            }
            else if (Array.isArray(value)) {
                initCollection(loaded, key);
                this.restoreObjects(functionList, descriptions, value);

                var arrayPropertyKey = `${key}_arrProps`;
                var additionalArrayProperties = loaded[arrayPropertyKey];

                if (additionalArrayProperties) {
                    Object.keys(additionalArrayProperties).forEach(k => {
                        value[k] = additionalArrayProperties[k];
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
    }

    private restoreFunction = (functionList: { [type: string]: { [id: string]: { function: Function, hash: number } } }, loaded: any, value: any, key: string): void => {
        if (value.indexOf('function#') > -1) {
            var parts = this.GetFunctionIdParts(value);
            var type = getPlural(parts.type);
            var typeList = functionList[type];

            if (!typeList[parts.functionId]) {
                console.log('Function with key: ' + parts.functionId + ' could not be found!');
            }
            else if (typeList[parts.functionId].hash != parts.hash) {
                console.warn(`Function with key: ${parts.functionId} was found but the hash does not match the stored hash! Did you change the order of actions in an array and/or change the function content? If you changed the order, you need to reset the game world. If you changed only the content, you can ignore this warning.`);
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

    private loadPictureFromDescription(loaded: any, key: string) {
        if (!loaded[key]) {
            return;
        }

        var parser = new DOMParser();
        var htmlDoc = parser.parseFromString(loaded[key], 'text/html');
        var pictureElement = htmlDoc.getElementsByClassName('picture')[0];
        var pictureSrc = pictureElement && pictureElement.getAttribute('src');

        if (pictureSrc) {
            loaded.picture = pictureSrc;
        }
    }
}