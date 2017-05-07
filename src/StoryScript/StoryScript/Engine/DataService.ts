module StoryScript {
    export interface IDataService {
        functionList: { [id: string]: { function: Function, hash: number } };
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
        private gameSpaceName: string;

        public functionList: { [id: string]: { function: Function, hash: number } };
        private descriptionPaths: { [id: string]: { loading: boolean, loaded: boolean, description: string } };

        constructor($q: ng.IQService, $http: ng.IHttpService, $localStorage: any, gameSpaceName: string) {
            var self = this;
            self.$http = $http;
            self.$q = $q;
            self.$localStorage = $localStorage;
            self.gameSpaceName = gameSpaceName;
        }

        public $get($q: ng.IQService, $http: ng.IHttpService, $localStorage: any, gameSpaceName: string): IDataService {
            var self = this;
            self.$http = $http;
            self.$q = $q;
            self.$localStorage = $localStorage;
            self.gameSpaceName = gameSpaceName;

            return {
                functionList: self.functionList,
                loadDescription: self.loadDescription,
                hasDescription: self.hasDescription,
                save: self.save,
                load: self.load
            };
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
            var clone = self.buildClone(value, pristineValues, null);
            self.$localStorage[self.gameSpaceName + '_' + key] = JSON.stringify({ data: clone });
        }

        public load<T>(key: string): T {
            var self = this;

            try {
                var jsonData = self.$localStorage[self.gameSpaceName + '_' + key];

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
                        var idAndHash = 'function#' + value.functionId + '#' + createFunctionHash(value);

                        if (pristineValues && pristineValues[key]) {
                            if (Array.isArray(clone)) {
                                clone.push(idAndHash);
                            }
                            else {
                                clone[key] = idAndHash;
                            }
                        }
                        else if (value.functionId) {
                            clone[key] = idAndHash;
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
                        var functionId = parts[1];
                        var hash = parseInt(parts[2]);

                        if (!self.functionList[functionId]) {
                            console.log('Function with key: ' + functionId + ' could not be found!');
                        }
                        else if (self.functionList[functionId].hash != hash) {
                            console.log('Function with key: ' + functionId + ' was found but the hash does not match the stored hash!');
                        }

                        loaded[key] = self.functionList[functionId].function;
                    }
                    else if (typeof value === 'string' && value.indexOf('function ') > -1) {
                        // Todo: create a new function instead of using eval.
                        loaded[key] = eval('(' + value + ')');
                    }
                }
            }
        }
    }

    DataService.$inject = ['$q', '$http', '$localStorage', 'gameNameSpace'];
}