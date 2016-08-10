module StoryScript {
    export interface IDataService {
        functionList: { [id: number]: Function };
        getDescription(descriptionName: string);
        save<T>(key: string, value: T, pristineValues?: T): void;
        load<T>(key: string): T;
    }
}

module StoryScript {
    export class DataService implements ng.IServiceProvider, IDataService {
        private $q: ng.IQService;
        private $http: ng.IHttpService;
        private $localStorage: any; // Todo: type;
        private gameSpaceName: string;

        public functionList: { [id: number]: Function };

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

        public save<T>(key: string, value: T, pristineValues?: T): void {
            var self = this;
            var clone = self.buildClone(value, pristineValues, null);
            self.$localStorage[self.gameSpaceName + '_' + key] = JSON.stringify({ data: clone });
        }

        public load<T>(key: string): T {
            var self = this;

            try {
                var data = JSON.parse(self.$localStorage[self.gameSpaceName + '_' + key]).data;

                if (isEmpty(data)) {
                    return null;
                }

                self.restore(data);
                return data;
            }
            catch (exception) {
                console.log('No data loaded for key ' + key);
            }
        }

        private buildClone(values, pristineValues, clone?) {
            var self = this;

            if (!clone) {
                clone = Array.isArray(values) ? [] : typeof value === "object" ? {} : values;
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

                if (!value) {
                    return;
                }
                else if (Array.isArray(value)) {
                    clone[key] = [];
                    self.buildClone(value, pristineValue, clone[key]);
                }
                else if (typeof value === "object") {
                    if (Array.isArray(clone)) {
                        clone.push(angular.copy(value));
                    }
                    else {
                        clone[key] = angular.copy(value);
                    }

                    self.buildClone(value, pristineValue, clone[key]);
                }
                else if (typeof value == 'function') {
                    if (!value.isProxy) {
                        if (pristineValues && pristineValues[key]) {
                            if (Array.isArray(clone)) {
                                clone.push('_function_' + value.functionId);
                            }
                            else {
                                clone[key] = '_function_' + value.functionId;
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
                    if (value.indexOf('_function_') > -1) {
                        loaded[key] = self.functionList[parseInt(value.replace('_function_', ''))];
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