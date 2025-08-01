import {StateProperties} from "./stateProperties.ts";
import {compareString, getId, getKeyPropertyNames, isDataRecord, propertyMatch} from "./utilityFunctions";
import {TypeProperty} from "../../constants.ts";

const deletedCollection: string = '_deleted';

if (Function.prototype.proxy === undefined) {
    // This code has to be outside the addFunctionExtensions to have the correct function scope for the proxy.
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

export function addUniqueId(entity: any) {
    if (entity[TypeProperty] && !entity[StateProperties.Id]) {
        entity[StateProperties.Id] = crypto.randomUUID();
    }
}

export function addArrayExtensions() {
    if ((<any>Array.prototype).get === undefined) {
        Object.defineProperty(Array.prototype, 'get', {
            enumerable: false,
            value: function (id: any) {
                let result: any;

                if (id) {
                    result = find(id, this, false)[0];
                } else {
                    result = this[0];
                }
                
                return result;
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
                return this[deletedCollection] ?? [];
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
                    deleted = this.getDeleted()?.find((e: {
                        [StateProperties.Id]: string;
                    }) => e[StateProperties.Id] === entity[StateProperties.Id]);
                } else {
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
                } else if (isDataRecord(entity)) {
                    entity[1][StateProperties.Added] = true;
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
                const firstCollectionItem = collection[0];
                
                if (firstCollectionItem 
                    && Array.isArray(firstCollectionItem) 
                    && firstCollectionItem.length === 2 
                    && typeof firstCollectionItem[0] === 'string') {
                    item = collection.get(item);
                }
                
                const index = findIndex(collection, item);

                if (index === -1) {
                    return;
                }
                
                // When an id was passed in, replace the item with the actual entity so we 
                // have the information we need to create the deletion record.
                if (typeof item === 'string') {
                    item = collection[index];
                }

                Array.prototype.splice.call(this, index, 1);
                collection[deletedCollection] = collection[deletedCollection] || [];

                // If a deletion record is deleted, simply move it to the deleted collection.
                if (item[StateProperties.Deleted]) {
                    collection[deletedCollection].push(item);
                    return item;
                }

                // Only add a deletion record when the item is removed from the array and the
                // item does not have the 'added' flag. Otherwise, it came from another array
                // that has the deletion record for this item.
                if (!item[StateProperties.Added]) {
                    // Add a unique id to the item to track it if it doesn't have one yet.
                    addUniqueId(item);

                    const {first, second} = getKeyPropertyNames(item);
                    let keyProps: { [x: string]: any; };

                    if (first && second) {
                        keyProps = {[first]: item[first], [second]: item[second]};
                    } else if (first) {
                        keyProps = {[first]: item[first]}
                    } else {
                        keyProps = {[second]: item[second]};
                    }

                    if (item[StateProperties.Id]) {
                        collection[deletedCollection].push({
                            ...keyProps,
                            [StateProperties.Deleted]: true,
                            [StateProperties.Id]: item[StateProperties.Id]
                        });
                    } else {
                        collection[deletedCollection].push({
                            ...keyProps,
                            [StateProperties.Deleted]: true
                        });
                    }
                }

                return item;
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

function findIndex(collection: any[], item: any) {
    let entry: any;

    if (isDataRecord(item)) {
        entry = collection.find(e => e[0] === item[0]);
    } else {
        entry = find(item, collection, false)[0];
    }

    let index: number;

    if (typeof entry === 'undefined') {
        index = collection.indexOf(item);
    } else {
        index = collection.indexOf(entry);
    }
    
    return index;
}

function find(id: any, array: any[], usePropertyMatch: boolean): any[] {
    if (typeof id === 'object') {
        let result = Array.prototype.filter.call(array, (x: any) => x === id);

        if (result.length === 0 && usePropertyMatch) {
            result = Array.prototype.filter.call(array, p => propertyMatch(id, p));
        }

        return result;
    }

    id = getId(id);

    return Array.prototype.filter.call(array, (x: { id: string, target: Function | string } | Function) => {
        let currentId: string | Function;
        
        if (typeof x === 'function') {
            currentId = x;
        } else if (Array.isArray(x) && x.length === 2) {
            currentId = x[0];
            
        } else {
            currentId = x.target ?? x[StateProperties.Id] ?? x.id;
        }

        return compareString(getId(currentId), id);
    });
}