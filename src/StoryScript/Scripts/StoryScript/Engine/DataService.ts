module StoryScript {
    export interface IDataService {
        getDescription(descriptionName: string);
        save<T>(key: string, value: T): void;
        load<T>(key: string): T;
    }
}

module StoryScript {
    export class DataService implements ng.IServiceProvider, IDataService {
        private $q: ng.IQService;
        private $http: ng.IHttpService;
        private $localStorage: any; // Todo: type;
        private definitionCollection = window['StoryScript'];

        constructor($q: ng.IQService, $http: ng.IHttpService, $localStorage: any) {
            var self = this;
            self.$http = $http;
            self.$q = $q;
            self.$localStorage = $localStorage;
        }

        public $get($q: ng.IQService, $http: ng.IHttpService, $localStorage: any): IDataService {
            var self = this;
            self.$http = $http;
            self.$q = $q;
            self.$localStorage = $localStorage;

            return {
                getDescription: self.getDescription,
                save: self.save,
                load: self.load
            };
        }

        public getDescription(descriptionId: string) {
            var self = this;
            var deferred = self.$q.defer();
            var url = '/locations/' + descriptionId + '.html';

            self.$http.get(url)
                .success(function (data, status, headers, config) {
                    deferred.resolve(data);
                }).
                error(function (data, status, headers, config) {
                    deferred.reject();
                });

            return deferred.promise;
        }

        public save<T>(key: string, value: T): void {
            var self = this;
            var clone = self.cloneAndTransform(value, null);
            self.$localStorage[key] = JSON.stringify({ data: clone });
        }

        public load<T>(key: string): T {
            var self = this;

            try {
                var savedValue = JSON.parse(self.$localStorage[key]).data;
                savedValue = self.restoreCollectionsAndFunctions(savedValue);
                return savedValue;
            }
            catch (exception) {
                console.log('No data loaded for key ' + key);
            }
        }

        private cloneAndTransform(item: any, chainPointer: string) {
            var self = this;

            if (!item) {
                return;
            }

            var clone = {};
            chainPointer = chainPointer || '';

            if (typeof item !== "object") {
                return item;
            }

            if (item.id) {
                chainPointer += '_' + item.id;
            }

            if (item.target) {
                chainPointer += '_' + item.target;
            }
            for (var key in item) {
                if (!item.hasOwnProperty(key)) {
                    continue;
                }

                // Ignore combat actions, they should be reapplied on init combat when a location loads.
                if (key == 'combatActions') {
                    continue;
                }

                var value = item[key];
                var definitionKey = self.toDefinitionKey(key);

                if (self.definitionCollection.hasOwnProperty(definitionKey)) {
                    clone[key] = [];

                    for (var n in value) {
                        // For collections, point to the default object. This allows restoring functions on items added to collections
                        // at runtime.
                        var pointer = self.definitionCollection[definitionKey] && self.definitionCollection[definitionKey][n] ? '_' + definitionKey : chainPointer + '_' + key;

                        clone[key].push(self.cloneAndTransform(value[n], pointer));
                    }
                }
                else if (typeof value === "object" && value) {
                    clone[key] = self.cloneAndTransform(item[key], chainPointer + '_' + key);
                }
                else if (typeof value == 'function') {
                    clone[key] = self.getFunctionPointerOrStringValue(chainPointer, item, key);
                }
                else {
                    clone[key] = value;
                }
            }

            return clone;
        }

        private getFunctionPointerOrStringValue(chainPointer, item, key) {
            var self = this;

            // Check whether the function exists on the original entity. If it does, return a pointer
            // to that function. If it does not, the function was added at runtime and must be saved
            // as a string.
            var pointerParts = chainPointer.split('_');
            pointerParts.shift();

            // Is there a definition collection for this pointer?
            var definitionCollection = self.definitionCollection[self.toDefinitionKey(pointerParts[0])];
            var original;

            if (definitionCollection) {
                // Get the original entity.
                original = definitionCollection[self.toDefinitionKey(pointerParts[1])]();

                if (original) {
                    pointerParts.shift();
                    pointerParts.shift();

                    // Traverse the original entity and its collections to get to the key value;
                    for (var i = 0; i < pointerParts.length; i++) {
                        //if (original.first) {
                        //    original = original.first(pointerParts[i]);
                        //}
                        //else {
                            original = original[pointerParts[i]];
                        //}

                        if (!original) {
                            break;
                        }
                    }
                }
            }

            if (!original || !original[key]) {
                original = self.definitionCollection.Actions[key];

                if (original) {
                    return '_fp_actions_' + key;
                }
                // If the original does not have the function, return the function's string value;
                else {
                    return item[key].toString();
                }
            }

            // Either there is no definition collection or the original also has the function. Return
            // the function pointer.
            return '_fp' + chainPointer;
        }

        private restoreCollectionsAndFunctions(item) {
            var self = this;

            if (!item) {
                return;
            }

            if (typeof item !== "object") {
                return item;
            }

            var arrayObject = convertOjectToArray(item);

            if (arrayObject) {
                item = arrayObject;

                for (var n in arrayObject) {
                    self.restoreCollectionsAndFunctions(arrayObject[n]);
                }

                return item;
            }

            for (var key in item) {
                if (!item.hasOwnProperty(key)) {
                    continue;
                }

                var value = item[key];

                if (value) {
                    if (typeof value === "object") {
                        arrayObject = convertOjectToArray(item[key]);

                        if (arrayObject) {
                            item[key] = arrayObject;

                            for (var n in arrayObject) {
                                self.restoreCollectionsAndFunctions(arrayObject[n]);
                            }
                        }
                        else {
                            self.restoreCollectionsAndFunctions(item[key]);
                        }
                    }

                    if (typeof value === 'string') {
                        if (value.substring(0, 3) === '_fp') {
                            var pointerParts = value.split('_');
                            pointerParts.shift();
                            pointerParts.shift();
                            var functionPointer = self.definitionCollection;

                            for (var n in pointerParts) {
                                //if (functionPointer.toString() === 'adventureGame.Collection' || functionPointer.toString() === 'adventureGame.DefinitionCollection') {
                                //    functionPointer = functionPointer.find(pointerParts[n]);
                                //}
                                //else {
                                functionPointer = functionPointer[pointerParts[n]];
                                //}
                            }

                            item[key] = functionPointer[key];
                        }
                        else if (value.indexOf('function ') == 0) {
                            item[key] = eval('(' + value + ')');
                        }
                    }
                }
            }

            return item;
        }

        private toDefinitionKey(text: string) {
            return text.substring(0, 1).toUpperCase() + text.substring(1);
        }
    }

    DataService.$inject = ['$q', '$http', '$localStorage'];
}