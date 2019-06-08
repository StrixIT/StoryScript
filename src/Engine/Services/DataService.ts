namespace StoryScript {
    export interface IDataService {
        functionList: { [type: string]: { [id: string]: { function: Function, hash: number } } };
        loadDescription(type: string, item: { id?: string, description?: string }): string;
        hasDescription(type: string, item: { id?: string, description?: string }): boolean;
        save<T>(key: string, value: T, pristineValues?: T): void;
        load<T>(key: string): T;
        getSaveKeys(): string[];
        copy<T>(value: T, pristineValue: T): T;
    }
}

namespace StoryScript {
    export class DataService implements IDataService {
        public functionList: { [type: string]: { [id: string]: { function: Function, hash: number } } };
        private descriptionBundle: Map<string, string>;
        private loadedDescriptions: { [id: string]: string };
        private functionArgumentRegex = /\([a-z-A-Z0-9:, ]{1,}\)/;

        constructor(private _localStorageService: ILocalStorageService, private _events: EventTarget, private _game: IGame, private _gameNameSpace: string, private _definitions: IDefinitions) {
            var self = this;
            self._definitions = self.getDefinitions(_definitions);
            self._game.definitions = self._definitions;
            self.registerFunctions();
            self.descriptionBundle = window.StoryScript.GetGameDescriptions();
        }
        
        save = <T>(key: string, value: T, pristineValues?: T): void => {
            var self = this;
            var clone = self.buildClone(value, pristineValues);
            self._localStorageService.set(self._gameNameSpace + '_' + key, JSON.stringify({ data: clone }));
        }

        copy = <T>(value: T, pristineValue: T): T => {
            var self = this;
            return self.buildClone(value, pristineValue);
        }

        getSaveKeys = (): string[] => {
            var self = this;
            return self._localStorageService.getKeys(self._gameNameSpace + '_' + DataKeys.GAME + '_');
        }

        load = <T>(key: string): T => {
            var self = this;

            try {
                var jsonData = self._localStorageService.get(self._gameNameSpace + '_' + key);

                if (jsonData) {
                    var data = JSON.parse(jsonData).data;

                    if (isEmpty(data)) {
                        return null;
                    }

                    self.restoreFunctions(data);
                    return data;
                }

                return null;
            }
            catch (exception) {
                console.log('No data loaded for key ' + key + '. Error: ' + exception.message);
            }

            return null;
        }

        loadDescription = (type: string, item: { id?: string, description?: string, picture?: string, hasHtmlDescription?: boolean }): string => {
            var self = this;
            var identifier = self.GetIdentifier(type, item);

            if (!self.loadedDescriptions) {
                self.loadedDescriptions = {};
            }

            var loadedDescription = self.loadedDescriptions[identifier];

            if (loadedDescription) {
                return loadedDescription;
            }
            
            var html = self.descriptionBundle.get(identifier);

            if (html === undefined) {
                console.log('No file ' + identifier + '.html found. Did you create this file already?');
                self.loadedDescriptions[identifier] = null;
                return null;
            }

            var parser = new DOMParser();
            var htmlDoc = parser.parseFromString(html, 'text/html');
            var pictureElement = htmlDoc.getElementsByClassName('picture')[0];
            var pictureSrc = pictureElement && pictureElement.getAttribute('src');

            if (pictureSrc) {
                item.picture = pictureSrc;
            }

            // Track that this item had a HTML description so it can be re-loaded later.
            item.hasHtmlDescription = true;
            item.description = html;
            self.loadedDescriptions[identifier] = html;
            return html;
        }

        hasDescription = (type: string, item: { id?: string, description?: string }): boolean => {
            var self = this;
            var identifier = self.GetIdentifier(type, item);
            return self.descriptionBundle.get(identifier) != null;
        }

        private GetIdentifier(type: string, item: { id?: string; description?: string; picture?: string; hasHtmlDescription?: boolean; }) {
            return (type + '/' + item.id).toLowerCase();
        }

        private getDefinitions(definitions: IDefinitions) {
            var self = this;
            var nameSpaceObject = window[self._gameNameSpace];

            definitions.locations = [];
            self.moveObjectPropertiesToArray(nameSpaceObject['Locations'], definitions.locations);

            definitions.enemies = [];
            self.moveObjectPropertiesToArray(nameSpaceObject['Enemies'], definitions.enemies);

            definitions.persons = [];
            self.moveObjectPropertiesToArray(nameSpaceObject['Persons'], definitions.persons);

            definitions.items = [];
            self.moveObjectPropertiesToArray(nameSpaceObject['Items'], definitions.items);

            definitions.quests = [];
            self.moveObjectPropertiesToArray(nameSpaceObject['Quests'], definitions.quests);

            definitions.actions = [];
            self.moveObjectPropertiesToArray(window['StoryScript']['Actions'], definitions.actions);
            self.moveObjectPropertiesToArray(nameSpaceObject['Actions'], definitions.actions);

            return definitions;
        }

        private moveObjectPropertiesToArray<T>(object: {}, collection: (() => T)[]) {
            for (var n in object) {
                if (object.hasOwnProperty(n)) {
                    collection.push(object[n]);
                }
            }
        }

        private buildClone(values, pristineValues, clone?) {
            var self = this;

            if (!clone) {
                clone = Array.isArray(values) ? [] : typeof values === "object" ? {} : values;
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

                self.getClonedValue(clone, value, key, pristineValues);
            }

            return clone;
        }

        private getClonedValue(clone: any, value: any, key: string, pristineValues: any) {
            var self = this;
            
            var pristineValue = pristineValues && pristineValues.hasOwnProperty(key) ? pristineValues[key] : undefined;

            if (Array.isArray(value)) {
                clone[key] = [];
                self.buildClone(value, pristineValue, clone[key]);
            }
            else if (typeof value === "object") {
                if (Array.isArray(clone)) {
                    clone.push({});
                }
                else {
                    clone[key] = {};
                }

                self.buildClone(value, pristineValue, clone[key]);
            }
            else if (typeof value === 'function') {
                self.getClonedFunction(clone, value, key);
            }
            else {
                clone[key] = value;
            }
        }

        private getClonedFunction(clone: any, value: any, key: string) {
            var self = this;

            if (!value.isProxy) {
                if (value.functionId) {
                    var parts = self.GetFunctionIdParts(value.functionId);

                    if (parts.type === 'actions' && !self.functionList[parts.type][parts.functionId]) {
                        var match: string = null;

                        for (var n in self.functionList[parts.type]) {
                            var entry = self.functionList[parts.type][n];

                            if (entry.hash === parts.hash) {
                                match = n;
                                break;
                            }
                        }

                        if (match) {
                            clone[key] = 'function#' + parts.type + '_' + match + '#' + parts.hash;
                        }
                        else {
                            clone[key] = value.toString();
                        }
                    }
                    else {
                        clone[key] = value.functionId;
                    }
                }
                else {
                    // Functions added during runtime must be serialized using the function() notation in order to be deserialized back
                    // to a function. Convert values that have an arrow notation.
                    let functionString = value.toString();

                    if (functionString.indexOf('function') == -1) {
                        var arrowIndex = functionString.indexOf('=>');

                        functionString = 'function' + functionString.match(self.functionArgumentRegex)[0] + functionString.substring(arrowIndex + 2).trim();
                    }

                    clone[key] = functionString;
                }
            }
        }

        private restoreFunctions(loaded) {
            var self = this;

            try
            {
            for (var key in loaded) {
                if (!loaded.hasOwnProperty(key)) {
                    continue;
                }

                var value = loaded[key];

                if (value == undefined) {
                    return;
                }
                else if (typeof value === "object") {
                    self.restoreFunctions(loaded[key]);
                }
                else if (typeof value === 'string') {
                    self.restoreFunctionFromString(loaded, value, key);
                }
            }
            }
            catch (ex) {
                console.log(ex);
            }
        }

        private restoreFunctionFromString(loaded: any, value: any, key: string) {
            var self = this;

            if (value.indexOf('function#') > -1) {
                var parts = self.GetFunctionIdParts(value);
                var type = GetPlural(parts.type);
                var typeList = self.functionList[type];

                if (!typeList[parts.functionId]) {
                    console.log('Function with key: ' + parts.functionId + ' could not be found!');
                }
                else if (typeList[parts.functionId].hash != parts.hash) {
                    console.log('Function with key: ' + parts.functionId + ' was found but the hash does not match the stored hash!');
                }

                loaded[key] = typeList[parts.functionId].function;
            }
            else if (typeof value === 'string' && value.indexOf('function') > -1) {
                loaded[key] = (<any>value).parseFunction();
            }
        }

        private GetFunctionIdParts(value: string): IFunctionIdParts {
            var parts = value.split('#');
            var functionPart = parts[1];
            var functionParts = functionPart.split('_');
            var type = functionParts[0];
            functionParts.splice(0, 1);
            var functionId = functionParts.join('_');
            var hash = parseInt(parts[2]);

            return {
                type: type,
                functionId: functionId,
                hash: hash
            }
        }

        private registerFunctions() {
            var self = this;
            var definitionKeys = getDefinitionKeys(self._definitions);
            self.functionList = {};
            var index = 0;

            for (var i in self._definitions) {
                var type = definitionKeys[index] || 'actions';
                var definitions = self._definitions[i];
                self.functionList[type] = {};

                for (var j in definitions) {
                    var definition = <() => {}>definitions[j];
                    self.getFunctions(type, definitionKeys, type === 'actions' ? definition : definition(), null);
                }

                index++;
            }
        }

        private getFunctions(type: string, definitionKeys: string[], entity: any, parentId: any) {
            var self = this;

            if (!parentId) {
                parentId = entity.id || entity.name;
            }

            for (var key in entity) {
                if (!entity.hasOwnProperty(key)) {
                    continue;
                }

                if (definitionKeys.indexOf(key) != -1 || key === 'target') {
                    continue;
                }

                var value = entity[key];

                if (value == undefined) {
                    return;
                }
                else if (typeof value === "object") {
                    self.getFunctions(type, definitionKeys, entity[key], entity[key].id ? parentId + '_' + key + '_' + entity[key].id : parentId + '_' + key);
                }
                else if (typeof value == 'function' && !value.isProxy) {
                    var functionId = parentId + '_' + key;

                    if (self.functionList[type][functionId]) {
                        throw new Error('Trying to register a duplicate function key: ' + functionId);
                    }

                    self.functionList[type][functionId] = {
                        function: value,
                        hash: createFunctionHash(value)
                    }
                }
            }
        }
    }
}