import { RuntimeProperties } from "./runtimeProperties";
import { getId, getKeyPropertyNames, propertyMatch } from "./utilities";

export const recordKeyPropertyName: string = 'recordKey';

const deletedCollection: string = '_deleted';

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
    console.log(Function.prototype.name);
    
    /* v8 ignore start  */
    if (Function.prototype.name === undefined) {
        // This is only used by legacy browsers
        Object.defineProperty(Function.prototype, 'name', {
            get: function () {
                return /function ([^(]*)/.exec(this + '')[1];
            }
        });
    }
    /* v8 ignore stop  */
}

// This allows deserializing functions added at runtime without using eval.
// Found at https://stackoverflow.com/questions/7650071/is-there-a-way-to-create-a-function-from-a-string-with-javascript
export function parseFunction<T extends Function>(text: string) {
    const funcReg = /function[\s]*([a-zA-Z0-9]*)(\([\s\w\d,]*\))[\s]*({[\S\s]*})/gmi;
    var match = funcReg.exec(text);

    if (match) {
        var args = match[2].substring(1, match[2].length - 1);
        return <T>(new Function(args, match[3]));
    }

    return null;
};

/**
 * This function creates a new function with the callbacks embedded. This makes the new function safe for serialization.
 * @param functionDefinition The main function to make safe for serialization.
 * @param callbacks The callback functions to embed. Use the names the callbacks have in the main function body.
 * @returns The main function with the callbacks embedded.
 */
export function makeSerializeSafe<T extends Function>(functionDefinition: T, callbacks: { [key: string]: Function }): T {
    let serialized = serializeFunction(functionDefinition);

    for (var key in callbacks) {
        var callback = callbacks[key];

        if (callback) {
            if (serialized.indexOf(key) > -1) {
                var startIndex = serialized.indexOf('{') + 1;
                serialized = serialized.substring(0, startIndex) + `const ${key} = ${serializeFunction(callback)};` + serialized.substring(startIndex);
            }
        }
    }

    return parseFunction<T>(serialized);
}

export function serializeFunction(value: Function) {
    const _functionArgumentRegex = /\([a-z-A-Z0-9:, ]{1,}\)/;

    // Functions added during runtime must be serialized using the function() notation in order to be deserialized back
    // to a function. Convert values that have an arrow notation.
    let functionString = value.toString();
    const argumentString = functionString.substring(0, functionString.indexOf('{'));

    if (argumentString.indexOf('function') == -1) {
        var arrowIndex = argumentString.indexOf('=>');

        // The arguments regex will fail when no arguments are used in production mode. Use empty brackets in that case.
        var args = functionString.match(_functionArgumentRegex)?.[0] || '()';

        functionString = 'function' + args + functionString.substring(arrowIndex + 2).trim();
    }

    return functionString;
}

export function addArrayExtensions() {
    if ((<any>Array.prototype).get === undefined) {
        Object.defineProperty(Array.prototype, 'get', {
            enumerable: false,
            value: function (id: any) {
                let result: any;

                if (id) {
                    result = find(id, this, false)[0];
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
                return find(id, this, false).filter(r => !r[RuntimeProperties.Deleted]);
            }
        });
    }

    if ((<any>Array.prototype).withDeleted === undefined) {
        Object.defineProperty(Array.prototype, 'withDeleted', {
            enumerable: false,
            value: function () {
                if (this[deletedCollection]) {
                    return [...this, ...this[deletedCollection]];
                }

                return this;
            }
        });
    }

    if ((<any>Array.prototype).removeDeleted === undefined) {
        Object.defineProperty(Array.prototype, 'removeDeleted', {
            enumerable: false,
            value: function () {
                const deleted = this.filter(e => e[RuntimeProperties.Deleted]);

                if (deleted.length > 0) {
                    deleted.forEach(d =>{
                        const index = this.indexOf(d);
                        Array.prototype.splice.call(this, index, 1);
                    });
                }

                return this;
            }
        });
    }

    if ((<any>Array.prototype).add === undefined) {
        Object.defineProperty(Array.prototype, 'add', {
            enumerable: false,
            writable: true,
            value: function (entity: any) {
                if (typeof entity === 'undefined') {
                    return;
                }

                const withDeleted = this.withDeleted();
                let existing = null;

                if (withDeleted.length > 0) {
                    existing = withDeleted.indexOf(entity) > -1 ? entity : null;

                    if (!existing) {
                        existing = find(entity, withDeleted, true).sort((a, b) => a[RuntimeProperties.Deleted] ? -1 : 1)[0];
                    }
                }

                // If an existing delete record is found, the item was originally removed from this array.
                // Remove the deleted record and the added flag so the original situation is restored.
                // Otherwise, add the added flag.
                if (existing && existing[RuntimeProperties.Deleted]) {
                    const deletedItems = this[deletedCollection];

                    if (deletedItems && deletedItems.indexOf(existing) > -1) {
                        deletedItems.splice(deletedItems.indexOf(existing), 1);
                    }

                    delete entity[RuntimeProperties.Added];
                } else {
                    entity[RuntimeProperties.Added] = true;
                }

                Array.prototype.push.call(this, entity);
            }
        });
    }

    if ((<any>Array.prototype).remove === undefined) {
        Object.defineProperty(Array.prototype, 'remove', {
            enumerable: false,
            writable: true,
            value: function (item: any, usePropertyMatch: boolean) {
                if (!item) {
                    return null;
                }

                let entry = find(item, this, usePropertyMatch)[0];
                let index = -1;

                if (typeof entry === 'undefined') {
                    index = this.indexOf(item);

                    if (index === -1) {
                        return null;
                    }

                    entry = item;
                }
                
                if (!entry) {
                    return null;
                }

                index = this.indexOf(entry);
                Array.prototype.splice.call(this, index, 1);
                return entry;
            }
        });
    }

    if ((<any>Array.prototype).delete === undefined) {
        Object.defineProperty(Array.prototype, 'delete', {
            enumerable: false,
            writable: true,
            value: function (item: any, usePropertyMatch?: boolean) {
                const collection = this;
                usePropertyMatch = typeof usePropertyMatch === 'undefined' ? false : usePropertyMatch;

                // Only add a deletion record when the item is removed from the array and the
                // item does not have the 'added' flag. This means the item is originally from
                // this array.
                let entry = collection.remove(item, usePropertyMatch);

                if (entry && !entry[RuntimeProperties.Added]) {
                    const { first, second } = getKeyPropertyNames(entry);
                    const keyProps = 
                        first && second ? { [first]: entry[first], [second]: entry[second] } :
                        first ? { [first]: entry[first] } :
                        second ? { [second]: entry[second] } : 
                        { [Object.keys(entry)[0]]: recordKeyPropertyName }

                    collection[deletedCollection] = collection[deletedCollection] || [];
                    collection[deletedCollection].push({ ...keyProps, [RuntimeProperties.Deleted]: true });
                }
            }
        });
    }

    if ((<any>Array.prototype).clear === undefined) {
        Object.defineProperty(Array.prototype, 'clear', {
            enumerable: false,
            value: function () {
                const collection = [...this];

                collection.forEach(e => {
                    this.delete(e);
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

function find(id: any, array: any[], usePropertyMatch: boolean): any[] {
    if (typeof id === 'object') {
        let result = Array.prototype.filter.call(array, (x: any) => x === id );

        if (result.length === 0 && usePropertyMatch) {
            result = Array.prototype.filter.call(array, p => propertyMatch(id, p));
        }

        return result;
    }

    id = getId(id);

    return Array.prototype.filter.call(array, (x: { id: string, target: Function | string } | Function) => { 
        var currentId = typeof x === 'function' ? x : x.target ?? x.id;
        return compareString(getId(currentId), id);
    });
}