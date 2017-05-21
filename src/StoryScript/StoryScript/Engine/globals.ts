module StoryScript {
    // This code has to be outside of the addFunctionExtensions to have the correct function scope for the proxy.
    if ((<any>Function.prototype).proxy === undefined) {
        (<any>Function.prototype).proxy = function (proxyFunction: Function, ...params) {
            var self = this;

            return (function () {
                var func = function () {
                    var args = [].slice.call(arguments);
                    args.splice(0, 0, self);
                    return proxyFunction.apply(this, args.concat(...params));
                };

                (<any>func).isProxy = true;

                return func;
            })();
        };
    }

    export function addFunctionExtensions() {
        // Need to cast to any for ES5 and lower
        if ((<any>Function.prototype).name === undefined) {
            Object.defineProperty(Function.prototype, 'name', {
                get: function () {
                    return /function ([^(]*)/.exec(this + "")[1];
                }
            });
        }
    }

    export function addArrayExtensions() {
        if ((<any>Array.prototype).get === undefined) {
            Object.defineProperty(Array.prototype, 'get', {
                enumerable: false,
                value: function (id: any) {
                    if (id) {
                        return find(id, this)[0];
                    }
                    else {
                        return this[0];
                    }
                }
            });
        }

        if ((<any>Array.prototype).all === undefined) {
            Object.defineProperty(Array.prototype, 'all', {
                enumerable: false,
                value: function (id: any) {
                    return find(id, this);
                }
            });
        }

        if ((<any>Array.prototype).remove === undefined) {
            Object.defineProperty(Array.prototype, 'remove', {
                enumerable: false,
                value: function (item: any) {
                    // Need to cast to any for ES5 and lower
                    var index = (<any>Array.prototype).findIndex.call(this, function (x) {
                        return x === item || (typeof item === 'function' && item.name === x.id) || (item.id && x.id && item.id === x.id);
                    });

                    if (index != -1) {
                        Array.prototype.splice.call(this, index, 1);
                    }
                }
            });
        }
    }

    export function getTypedValue(value: string): any {
        if (value === undefined || value === null) {
            return value;
        }

        if (value.toLowerCase() === 'false') {
            return false;
        }
        else if (value.toLowerCase() === 'true') {
            return true;
        }

        var number = parseFloat(value);

        if (number !== NaN) {
            return number;
        }

        return value;
    }

    export class DataKeys {
        static HIGHSCORES: string = 'highScores';
        static CHARACTER: string = 'character';
        static STATISTICS: string = 'statistics';
        static LOCATION: string = 'location';
        static PREVIOUSLOCATION: string = 'previousLocation';
        static WORLD: string = 'world';
        static WORLDPROPERTIES: string = 'worldProperties';
    }

    function find(id: any, array: any[]): any[] {
        if (typeof id === 'function') {
            id = id.name;
        }
        else if (typeof id === 'object') {
            id = id.id;
        }

        return Array.prototype.filter.call(array, matchById(id));
    }

    function matchById(id) {
        return function (x) {
            return x.id.toLowerCase() === id.toLowerCase() || (x.target && x.target === id || (typeof x.target === 'function' && x.target.name === id));
        };
    }
}