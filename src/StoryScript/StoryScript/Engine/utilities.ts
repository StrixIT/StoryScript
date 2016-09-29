module StoryScript {
    export function isEmpty(object: any, property?: string) {
        var objectToCheck = property ? object[property] : object;
        return objectToCheck ? Object.keys(objectToCheck).length === 0 : true;
    }

    export function definitionToObject<T>(definition: () => T): T {
        var instance = definition();
        // Need to cast to any for ES5 and lower
        (<any>instance).id = (<any>definition).name;
        return instance;
    }

    export function random<T>(collection: T[] | ([() => T]), selector?: (item: T) => boolean): T {
        if (!collection) {
            return null;
        }

        var selection = getFilteredInstantiatedCollection<T>(collection, selector);

        if (selection.length == 0) {
            return null;
        }

        var index = Math.floor(Math.random() * selection.length);
        return selection[index];
    }

    export function randomList<T>(collection: T[] | ([() => T]), count: number, selector?: (item: T) => boolean): ICollection<T> {
        var selection = getFilteredInstantiatedCollection<T>(collection, selector);
        var results = <ICollection<T>>[];

        if (count === undefined) {
            count = selection.length;
        }

        if (selection.length > 0) {
            while (results.length < count && results.length < selection.length) {
                var index = Math.floor(Math.random() * selection.length);

                if (results.indexOf(selection[index]) == -1) {
                    results.push(selection[index]);
                }
            }
        }

        return results;
    }

    export function find<T>(collection: T[] | ([() => T]), selector: string | (() => T) | ((item: T) => boolean)): T {
        if (!collection && !selector) {
            return null;
        }

        // Are we working with a definition collection?
        if (typeof collection[0] === 'function') {

            // If so, is the selector a string value or a named function?
            if (typeof selector === 'string' || ((<any>selector).name)) {

                // Then, use the string or function name to get the definition.
                if ((<any>selector).name) {
                    selector = <string>(<any>selector).name;
                }

                var match = (<[() => T]>collection).filter((definition: () => T) => {
                    return (<any>definition).name === <string>selector;
                });

                return match[0] ? definitionToObject(match[0]) : null;
            }
        }

        var results = getFilteredInstantiatedCollection<T>(collection, <(item: T) => boolean>selector);

        if (results.length > 1) {
            throw new Error('Collection contains more than one match!');
        }

        return results[0] ? results[0] : null;
    }

    export function custom<T>(definition: () => T, customData: {}) {
        return (): T => {
            var instance = definition();
            return angular.extend(instance, customData);
        };
    }

    function getFilteredInstantiatedCollection<T>(collection: T[] | ([() => T]), selector?: (item: T) => boolean) {
        var collectionToFilter = <T[]>[]

        if (typeof collection[0] === 'function') {
            (<[() => T]>collection).forEach((def: () => T) => {
                collectionToFilter.push(definitionToObject(def));
            });
        }
        else {
            collectionToFilter = <T[]>collection;
        }

        return selector ? collectionToFilter.filter(selector) : collectionToFilter;
    }
}