namespace StoryScript
{
    export interface IHttpService {
        get(url: string): Promise<any>;
    }

    export class HttpService implements ng.IServiceProvider, IHttpService
    {
        constructor() {
        }

        public $get(): IHttpService {
            var self = this;

            return {
                get: self.get
            };
        }

        get = (url: string): Promise<any> =>
        {
            var promise = new Promise<any>(function (resolve, reject) {
                var client = new XMLHttpRequest();
                client.open('get', '/' + url, true);

                client.onload = function () {
                    if (this.status == 200) {
                      resolve(this.response);
                    } else {
                      reject(this.statusText);
                    }
                  };
                  client.onerror = function () {
                    reject(this.statusText);
                  };

                  client.send();
            });

            return promise;
        }
    }
}