import { RuntimeProperties } from "./runtimeProperties";
import { getId } from "./utilities";

if (Function.prototype.proxy === undefined) {
    // This code has to be outside of the addFunctionExtensions to have the correct function scope for the proxy.
    Function.prototype.proxy = function (proxyFunction: Function, ...params) {
        var originalFunction = this;

        return (function () {
            // Creating an object to attach the function to is a workaround to not
            // trigger the TypeScript error TS2683: 'this' implicitly has type 'any'.
            var func = { 
                func: function () {
                    var args = [].slice.call(arguments);
            
                    if (originalFunction) {
                        args.splice(0, 0, this);
                        args.splice(1, 0, originalFunction);
                    }
                    
                    return proxyFunction.apply(this, args.concat(...params));
                }
            };

            func.func.isProxy = true;
            return func.func;
        })();
    };
}

export function addFunctionExtensions() {
    if (Function.prototype.name === undefined) {
        /* istanbul ignore next -- @preserve */
        // This is only used by legacy browsers
        Object.defineProperty(Function.prototype, 'name', {
            get: function () {
                return /function ([^(]*)/.exec(this + '')[1];
            }
        });
    }
}

// This allows deserializing functions added at runtime without using eval.
// Found at https://stackoverflow.com/questions/7650071/is-there-a-way-to-create-a-function-from-a-string-with-javascript
export function parseFunction (text: string) {
    var funcReg = /function[\s]*([a-zA-Z0-9]*)(\([\s\w\d,]*\))[\s]*({[\S\s]*})/gmi;
    var match = funcReg.exec(text);

    if (match) {
        var args = match[2].substring(1, match[2].length - 1);
        return new Function(args, match[3]);
    }

    return null;
};

export function addArrayExtensions() {
    if ((<any>Array.prototype).get === undefined) {
        Object.defineProperty(Array.prototype, 'get', {
            enumerable: false,
            value: function (id: any) {
                let result: any;

                if (id) {
                    result = find(id, this)[0];
                    find(id, this)[0];
                }
                else {
                    result = this[0];
                }

                // Don't return deleted properties.
                return result && result[RuntimeProperties.Deleted] ? undefined : result;
            }
        });
    }

    if ((<any>Array.prototype).all === undefined) {
        Object.defineProperty(Array.prototype, 'all', {
            enumerable: false,
            value: function (id: any) {
                return find(id, this).filter(r => !r[RuntimeProperties.Deleted]);
            }
        });
    }

    if ((<any>Array.prototype).withDeleted === undefined) {
        Object.defineProperty(Array.prototype, 'withDeleted', {
            enumerable: false,
            value: function (id: any) {
                if (this['_deleted']) {
                    return [...this, ...this['_deleted']];
                }

                return this;
            }
        });
    }

    if ((<any>Array.prototype).add === undefined) {
        Object.defineProperty(Array.prototype, 'add', {
            enumerable: false,
            value: function (entity: any) {
                if (typeof entity === 'undefined') {
                    return;
                }

                if (entity[RuntimeProperties.Deleted]) {
                    delete entity[RuntimeProperties.Deleted];

                } else {
                    entity[RuntimeProperties.Added] = true;
                }

                this.push(entity);
            }
        });
    }

    if ((<any>Array.prototype).remove === undefined) {
        Object.defineProperty(Array.prototype, 'remove', {
            enumerable: false,
            writable: true,
            value: function (item: any) {
                if (!item) {
                    return;
                }

                let entry = find(item, this)[0];
                let index = -1;

                if (typeof entry === 'undefined') {
                    index = this.indexOf(item);
                    entry = item;
                }
                
                if (!entry) {
                    return;
                }

                index = this.indexOf(entry);
                entry[RuntimeProperties.Deleted] = true;
                this['_deleted'] = this['_deleted'] || [];
                this['_deleted'].push(entry);
                Array.prototype.splice.call(this, index, 1);
            }
        });
    }

    if ((<any>Array.prototype).clear === undefined) {
        Object.defineProperty(Array.prototype, 'clear', {
            enumerable: false,
            value: function () {
                const collection = this;

                collection.forEach(e => {
                    this.remove(e);
                });
            }
        });
    }
}

export function createFunctionHash(func: Function): number {
    return createHash(func.toString());
}

export function createHash(value: string): number {
    var hash = 0;

    if (!value || value.length == 0) {
        return hash;
    }

    for (var i = 0; i < value.length; i++) {
        var char = value.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }

    return hash;
}

export function compareString(left: string, right: string): boolean {
    if ((left === undefined && right === undefined) || (left === null && right === null)) {
        return true;
    }
    else if ((left === null || left === undefined) || (right === null  || right === undefined)) {
        return false;
    }

    return left.toLowerCase() === right.toLowerCase();
}

function find(id: any, array: any[]): any[] {
    if (typeof id === 'object') {
        return Array.prototype.filter.call(array, (x: any) => x === id );
    }

    id = getId(id);

    return Array.prototype.filter.call(array, (x: { id: string, target: Function | string }) => { 
        var target = getId(x.target);
        return compareString(x.id, id)  || compareString(target, id);
    });
}