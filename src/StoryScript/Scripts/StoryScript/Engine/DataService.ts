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
        private definitions: any;

        constructor($q: ng.IQService, $http: ng.IHttpService, $localStorage: any, definitions: any) {
            var self = this;
            self.$http = $http;
            self.$q = $q;
            self.$localStorage = $localStorage;
            self.definitions = definitions;
        }

        public $get($q: ng.IQService, $http: ng.IHttpService, $localStorage: any, definitions: any): IDataService {
            var self = this;
            self.$http = $http;
            self.$q = $q;
            self.$localStorage = $localStorage;
            self.definitions = definitions;

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
            var clone = angular.copy(value);
            self.$localStorage[key] = JSON.stringify({ data: clone });
        }

        public load<T>(key: string): T {
            var self = this;

            try {
                return JSON.parse(self.$localStorage[key]).data;
            }
            catch (exception) {
                console.log('No data loaded for key ' + key);
            }
        }
    }

    DataService.$inject = ['$q', '$http', '$localStorage', 'definitions'];
}