import { StateProperties } from "./stateProperties.ts";
import { getId, getKeyPropertyNames, propertyMatch } from "./utilities";
import {TypeProperty} from "../../constants.ts";

const deletedCollection: string = '_deleted';

if (Function.prototype.proxy === undefined) {
    // This code has to be outside of the addFunctionExtensions to have the correct function scope for the proxy.
    Function.prototype.proxy = function (proxyFunction: Function, ...params: any[]) {
        const originalFunction = this;

        return (function () {
            // Creating an object to attach the function to is a workaround to not
            // trigger the TypeScript error TS2683: 'this' implicitly has type 'any'.
            const func = { 
                func: function () {
                    const args = [].slice.call(arguments);
            
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
    const funcReg = /function[\s]*([a-z\d]*)(\([\s\w\d,]*\))[\s]*({[\S\s]*})/gmi;
    const match = funcReg.exec(text);

    if (match) {
        const args = match[2].substring(1, match[2].length - 1);
        return <T>(new Function(args, match[3]));
    }

    return null;
}

/**
 * This function creates a new function with the callbacks embedded. This makes the new function safe for serialization.
 * @param functionDefinition The main function to make safe for serialization.
 * @param callbacks The callback functions to embed. Use the names the callbacks have in the main function body.
 * @returns The main function with the callbacks embedded.
 */
export function makeSerializeSafe<T extends Function>(functionDefinition: T, callbacks: { [key: string]: Function }): T {
    let serialized = serializeFunction(functionDefinition);

    for (const key in callbacks) {
        const callback = callbacks[key];

        if (callback) {
            if (serialized.indexOf(key) > -1) {
                const startIndex = serialized.indexOf('{') + 1;
                serialized = serialized.substring(0, startIndex) + `const ${key} = ${serializeFunction(callback)};` + serialized.substring(startIndex);
            }
        }
    }

    return parseFunction<T>(serialized);
}

export function serializeFunction(value: Function) {
    const _functionArgumentRegex = /\([a-z-A-Z0-9:, ]+\)/;

    // Functions added during runtime must be serialized using the function() notation in order to be deserialized back
    // to a function. Convert values that have an arrow notation.
    let functionString = value.toString();
    const argumentString = functionString.substring(0, functionString.indexOf('{'));

    if (argumentString.indexOf('function') == -1) {
        const arrowIndex = argumentString.indexOf('=>');

        // The arguments regex will fail when no arguments are used in production mode. Use empty brackets in that case.
        const args = _functionArgumentRegex.exec(functionString)?.[0] || '()';

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
                return result?.[StateProperties.Deleted] ? undefined : result;
            }
        });
    }

    if ((<any>Array.prototype).all === undefined) {
        Object.defineProperty(Array.prototype, 'all', {
            enumerable: false,
            value: function (id: any) {
                return find(id, this, false).filter(r => !r[StateProperties.Deleted]);
            }
        });
    }

    if ((<any>Array.prototype).getDeleted === undefined) {
        Object.defineProperty(Array.prototype, 'getDeleted', {
            enumerable: false,
            value: function () {
                return this[deletedCollection];
            }
        });
    }

    if ((<any>Array.prototype).removeDeleted === undefined) {
        Object.defineProperty(Array.prototype, 'removeDeleted', {
            enumerable: false,
            value: function () {
                const deleted = this.filter((e: any) => e[StateProperties.Deleted]);

                if (deleted.length > 0) {
                    deleted.forEach((d: any) =>{
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
                
                let deleted: any;

                // Add a unique id to identify the add record if it doesn't have one yet, so we can
                // match it to a delete record when appropriate. Otherwise, try and get a matching 
                // delete record to see whether the record originally came from this array.
                if (entity[StateProperties.Id]) {
                    deleted = this.getDeleted()?.find((e: { [StateProperties.Id]: string; }) => e[StateProperties.Id] === entity[StateProperties.Id]);
                } 
                else {
                    addUniqueId(entity);    
                }

                // If an existing delete record is found, the item was originally removed from this array.
                // Remove the deleted record, the added flag and unique id so the original situation is
                // restored. Otherwise, add the added flag.
                if (deleted) {
                    const deletedItems = this[deletedCollection];
                    deletedItems.splice(deletedItems.indexOf(deleted), 1);
                    delete entity[StateProperties.Id];
                    delete entity[StateProperties.Added];
                }
                else {
                    entity[StateProperties.Added] = true;
                }

                Array.prototype.push.call(this, entity);
            }
        });
    }

    if ((<any>Array.prototype).delete === undefined) {
        Object.defineProperty(Array.prototype, 'delete', {
            enumerable: false,
            writable: true,
            value: function (item: any) {
                if (typeof item === 'undefined') {
                    return;
                }

                const collection = this;
                let entry = find(item, this, false)[0];
                let index: number;
                
                if (typeof entry === 'undefined') {
                    index = collection.indexOf(item);
                } else {
                    index  = this.indexOf(entry);
                }

                if (index === -1) {
                    return;
                }
                
                Array.prototype.splice.call(this, index, 1);
                collection[deletedCollection] = collection[deletedCollection] || [];
                
                // If a deletion record is deleted, simply move it to the deleted collection.
                if (item[StateProperties.Deleted])
                {
                    collection[deletedCollection].push(item);
                    return;
                }

                // Only add a deletion record when the item is removed from the array and the
                // item does not have the 'added' flag. Otherwise, it came from another array
                // that has the deletion record for this item.
                if (!item[StateProperties.Added]) {
                    // Add a unique id to the item to track it if it doesn't have one yet.
                    addUniqueId(item);
                    
                    const { first, second } = getKeyPropertyNames(item);
                    let keyProps: { [x: string]: any; };
                    
                    if (first && second) {
                        keyProps = { [first]: item[first], [second]: item[second] };
                    } else if (first) {
                        keyProps = {[first]: item[first]}
                    } else {
                        keyProps = {[second]: item[second]};
                    }
                    
                    collection[deletedCollection].push({ ...keyProps, [StateProperties.Deleted]: true, [StateProperties.Id]: item[StateProperties.Id] });
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
        const currentId = typeof x === 'function' ? x : x.target ?? x.id;
        return compareString(getId(currentId), id);
    });
}

function addUniqueId(entity: any) {
    if (entity[TypeProperty] && !entity[StateProperties.Id]) {
        entity[StateProperties.Id] = crypto.randomUUID();
    }
}