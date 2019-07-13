namespace StoryScript {
    export interface IDataService {
        loadDescription(type: string, item: { id?: string, description?: string }): string;
        hasDescription(type: string, item: { id?: string, description?: string }): boolean;
        save<T>(key: string, value: T): void;
        load<T>(key: string, pristineValues?: T): T;
        getSaveKeys(): string[];
        copy<T>(value: T): T;
    }
}

namespace StoryScript {
    export class DataService implements IDataService {
        private descriptionBundle: Map<string, string>;
        private loadedDescriptions: { [id: string]: string };
        private functionArgumentRegex = /\([a-z-A-Z0-9:, ]{1,}\)/;

        constructor(private _localStorageService: ILocalStorageService, private _events: EventTarget, private _game: IGame, private _gameNameSpace: string) {
            var self = this;
            self.descriptionBundle = window.StoryScript.GetGameDescriptions();
        }
        
        save = <T>(key: string, value: T): void => {
            var self = this;
            var clone = self.buildClone(value);
            self._localStorageService.set(self._gameNameSpace + '_' + key, JSON.stringify({ data: clone }));
        }

        copy = <T>(value: T): T => {
            var self = this;
            return self.buildClone(value);
        }

        getSaveKeys = (): string[] => {
            var self = this;
            return self._localStorageService.getKeys(self._gameNameSpace + '_' + DataKeys.GAME + '_');
        }

        load = <T>(key: string, pristineValues?: T): T => {
            var self = this;

            try {
                var jsonData = self._localStorageService.get(self._gameNameSpace + '_' + key);

                if (jsonData) {
                    var data = JSON.parse(jsonData).data;

                    if (isEmpty(data)) {
                        return null;
                    }

                    self.restoreObjects(data, pristineValues);

                    return pristineValues || data;
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

        private buildClone(values, clone?) {
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
                else if (value.isOriginal) {
                    continue;
                }
                // Exclude hashkeys used by angularjs.
                else if (key.indexOf('$$hashKey') > -1) {
                    continue;
                }

                self.getClonedValue(clone, value, key);
            }

            return clone;
        }

        private getClonedValue(clone: any, value: any, key: string) {
            var self = this;

            if (Array.isArray(value)) {
                clone[key] = [];
                self.buildClone(value, clone[key]);
            }
            else if (typeof value === "object") {
                if (Array.isArray(clone)) {
                    clone.push({});
                }
                else {
                    clone[key] = {};
                }

                self.buildClone(value, clone[key]);
            }
            else if (typeof value === 'function') {
                self.serializeFunction(clone, value, key);
            }
            else {
                clone[key] = value;
            }
        }

        private serializeFunction(clone: any, value: any, key: string) {
            var self = this;

            if (!value.isProxy && !value.isOriginal) {
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

        private restoreObjects<T>(loaded, pristineValues: T) {
            var self = this;

            for (var key in loaded) {
                if (!loaded.hasOwnProperty(key)) {
                    continue;
                }

                var value = loaded[key];
                var pristineValue = pristineValues && pristineValues[key];

                if (value === undefined) {
                    if (pristineValues) {
                        pristineValues[key] = undefined;
                    }

                    return;
                }
                else if (pristineValue === undefined) {
                    if (pristineValues) {
                        pristineValues[key] = value;
                    }
                }
                else if (Array.isArray(value)) {
                    self.restoreObjects(value, pristineValue);
                }
                else if (typeof value === "object") {
                    self.restoreObjects(value, pristineValue);
                }
                else if (typeof value === 'string' && value.indexOf('function') > -1) {
                    pristineValues[key] = (<any>value).parseFunction();
                }
                else {
                    pristineValues[key] = value;
                }
            }
        }
    }
}