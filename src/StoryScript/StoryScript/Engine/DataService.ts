module StoryScript {
    export interface IDataService {
        functionList: { [type: string]: { [id: string]: { function: Function, hash: number } } };
        loadDescription(type: string, item: { id?: string, description?: string });
        hasDescription(type: string, item: { id?: string, description?: string });
        save<T>(key: string, value: T, pristineValues?: T): void;
        load<T>(key: string): T;
    }
}

module StoryScript {
    export class DataService implements ng.IServiceProvider, IDataService {
        private $q: ng.IQService;
        private $http: ng.IHttpService;
        private $localStorage: any;
        private gameNameSpace: string;
        private definitions: IDefinitions;

        public functionList: { [type: string]: { [id: string]: { function: Function, hash: number } } };
        private descriptionPaths: { [id: string]: { loading: boolean, loaded: boolean, description: string } };

        constructor($q: ng.IQService, $http: ng.IHttpService, $localStorage: any, game: IGame, gameNameSpace: string, definitions: IDefinitions) {
            var self = this;
            self.$http = $http;
            self.$q = $q;
            self.$localStorage = $localStorage;
            self.gameNameSpace = gameNameSpace;
            self.definitions = self.getDefinitions(definitions);
            game.definitions = self.definitions;
            self.registerFunctions();
        }

        public $get($q: ng.IQService, $http: ng.IHttpService, $localStorage: any, game: IGame, gameNameSpace: string, definitions: IDefinitions): IDataService {
            var self = this;
            self.$http = $http;
            self.$q = $q;
            self.$localStorage = $localStorage;
            self.gameNameSpace = gameNameSpace;
            game.definitions = self.getDefinitions(definitions);

            return {
                functionList: self.functionList,
                loadDescription: self.loadDescription,
                hasDescription: self.hasDescription,
                save: self.save,
                load: self.load
            };
        }

        private getDefinitions(definitions: IDefinitions) {
            var self = this;
            var nameSpaceObject = window[self.gameNameSpace];

            definitions.locations = <[() => ILocation]>[];
            self.moveObjectPropertiesToArray(nameSpaceObject['Locations'], definitions.locations);

            definitions.enemies = <[() => IEnemy]>[];
            self.moveObjectPropertiesToArray(nameSpaceObject['Enemies'], definitions.enemies);

            definitions.persons = <[() => IPerson]>[];
            self.moveObjectPropertiesToArray(nameSpaceObject['Persons'], definitions.persons);

            definitions.items = <[() => IItem]>[];
            self.moveObjectPropertiesToArray(nameSpaceObject['Items'], definitions.items);

            definitions.quests = <[() => IQuest]>[];
            self.moveObjectPropertiesToArray(nameSpaceObject['Quests'], definitions.quests);

            definitions.actions = <[() => IAction]>[];
            self.moveObjectPropertiesToArray(window['StoryScript']['Actions'], definitions.actions);
            self.moveObjectPropertiesToArray(nameSpaceObject['Actions'], definitions.actions);

            return definitions;
        }

        private moveObjectPropertiesToArray<T>(object: {}, collection: [() => T]) {
            for (var n in object) {
                if (object.hasOwnProperty(n)) {
                    collection.push(object[n]);
                }
            }
        }

        public loadDescription(type: string, item: { id?: string, description?: string }) {
            var self = this;
            var deferred = self.$q.defer();
            var identifier = type + '/' + item.id;

            if (!self.descriptionPaths) {
                self.descriptionPaths = {};
            }

            var pathEntry = self.descriptionPaths[identifier];
            var description = pathEntry ? pathEntry.description : null;

            if (!pathEntry) {
                var loadDescription = (type === 'locations' || type === 'persons') || item.description === Constants.HTML;
                pathEntry = { loading: false, loaded: !loadDescription, description: loadDescription ? null : item.description };
                self.descriptionPaths[identifier] = pathEntry;
            }

            if (!pathEntry.loading && !pathEntry.loaded) {
                pathEntry.loading = true;

                self.$http.get(identifier + '.html').success((result: string) => {
                    item.description = result;
                    pathEntry.loading = false;
                    pathEntry.loaded = true;
                    pathEntry.description = result;
                    deferred.resolve(result);
                }).error(() => {
                    pathEntry.loading = false;
                    pathEntry.loaded = true;
                    pathEntry.description = null;
                    deferred.reject();
                });
            }
            else {
                deferred.resolve(description);
            }

            return deferred.promise;
        }

        public hasDescription(type: string, item: { id?: string, description?: string }) {
            var self = this;
            var result = false;
            var identifier = type + '/' + item.id;

            if (!self.descriptionPaths) {
                self.descriptionPaths = {};
            }

            var pathEntry = self.descriptionPaths[identifier];

            if (!pathEntry) {
                self.loadDescription(type, item);
            }

            else if (pathEntry.loaded && pathEntry.description) {
                result = true;
            }

            return result;
        }

        public save<T>(key: string, value: T, pristineValues?: T): void {
            var self = this;
            var clone = self.buildClone(value, pristineValues);
            self.$localStorage[self.gameNameSpace + '_' + key] = JSON.stringify({ data: clone });
        }

        public load<T>(key: string): T {
            var self = this;

            try {
                var jsonData = self.$localStorage[self.gameNameSpace + '_' + key];

                if (jsonData) {
                    var data = JSON.parse(jsonData).data;

                    if (isEmpty(data)) {
                        return null;
                    }

                    self.restore(data);
                    return data;
                }

                return null;
            }
            catch (exception) {
                console.log('No data loaded for key ' + key + '. Error: ' + exception.message);
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

                var pristineValue = pristineValues && pristineValues.hasOwnProperty(key) ? pristineValues[key] : undefined;

                if (value === undefined) {
                    continue;
                }
                else if (value === null) {
                    clone[key] = null;
                }
                else if (Array.isArray(value)) {
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
                else if (typeof value == 'function') {
                    if (!value.isProxy) {
                        if (value.functionId) {
                            var parts = value.functionId.split('#');
                            var functionPart = parts[1];
                            var functionParts = functionPart.split('_');
                            var type = functionParts[0];
                            functionParts.splice(0, 1);
                            var functionId = functionParts.join('_');
                            var hash = parseInt(parts[2]);

                            if (type === 'actions' && !self.functionList[type][functionId]) {
                                var match: string = null;

                                for (var n in self.functionList[type]) {
                                    var entry = self.functionList[type][n];

                                    if (entry.hash === hash) {
                                        match = n;
                                        break;
                                    }
                                }

                                if (match) {
                                    clone[key] = 'function#' + type + '_' + match + '#' + hash;
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
                            clone[key] = value.toString();
                        }
                    }
                }
                else {
                    clone[key] = value;
                }
            }

            return clone;
        }

        private restore(loaded) {
            var self = this;

            for (var key in loaded) {
                if (!loaded.hasOwnProperty(key)) {
                    continue;
                }

                var value = loaded[key];

                if (value == undefined) {
                    return;
                }
                else if (typeof value === "object") {
                    self.restore(loaded[key]);
                }
                else if (typeof value === 'string') {
                    if (value.indexOf('function#') > -1) {
                        var parts = value.split('#');
                        var functionPart = parts[1];
                        var functionParts = functionPart.split('_');
                        var type = functionParts[0];
                        functionParts.splice(0, 1);
                        var functionId = functionParts.join('_');
                        var hash = parseInt(parts[2]);

                        if (!self.functionList[type][functionId]) {
                            console.log('Function with key: ' + functionId + ' could not be found!');
                        }
                        else if (self.functionList[type][functionId].hash != hash) {
                            console.log('Function with key: ' + functionId + ' was found but the hash does not match the stored hash!');
                        }

                        loaded[key] = self.functionList[type][functionId].function;
                    }
                    else if (typeof value === 'string' && value.indexOf('function ') > -1) {
                        // Todo: create a new function instead of using eval.
                        loaded[key] = eval('(' + value + ')');
                    }
                }
            }
        }

        private registerFunctions() {
            var self = this;
            var definitionKeys = getDefinitionKeys(self.definitions);
            self.functionList = {};
            var index = 0;

            for (var i in self.definitions) {
                var type = definitionKeys[index] || 'actions';
                var definitions = self.definitions[i];
                self.functionList[type] = {};

                for (var j in definitions) {
                    var definition = <() => {}>definitions[j];
                    self.getFunctions(type, definitionKeys, StoryScript.definitionToObject(definition, type, self.definitions), null);
                }

                index++;
            }
        }

        private getFunctions(type: string, definitionKeys: string[], location: any, parentId: any) {
            var self = this;

            if (!parentId) {
                parentId = location.id || location.name;
            }

            for (var key in location) {
                if (!location.hasOwnProperty(key)) {
                    continue;
                }

                if (definitionKeys.indexOf(key) != -1 || key === 'target') {
                    continue;
                }

                var value = location[key];

                if (value == undefined) {
                    return;
                }
                else if (typeof value === "object") {
                    self.getFunctions(type, definitionKeys, location[key], parentId + '_' + key);
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

    DataService.$inject = ['$q', '$http', '$localStorage', 'game', 'gameNameSpace', 'definitions'];
}