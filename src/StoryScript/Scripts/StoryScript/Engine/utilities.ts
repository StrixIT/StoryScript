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

        var collectionToFilter = <T[]>[];

        if (typeof collection[0] === 'function') {
            (<[() => T]>collection).forEach((def: () => T) => {
                collectionToFilter.push(definitionToObject(def));
            });
        }
        else {
            collectionToFilter = <T[]>collection;
        }

        var selection = selector ? collectionToFilter.filter(selector) : collectionToFilter;
        var index = Math.floor(Math.random() * selection.length);
        return selection[index];
    }

    export function find<T>(collection: T[] | ([() => T]), selector: (item: T) => boolean): T {
        if (!collection && !selector) {
            return null;
        }

        var collectionToFilter = <T[]>[];

        if (typeof collection[0] === 'function') {
            (<[() => T]>collection).forEach((def: () => T) => {
                collectionToFilter.push(definitionToObject(def));
            });
        }
        else {
            collectionToFilter = <T[]>collection;
        }

        var results = collectionToFilter.filter(selector);

        if (results.length > 1) {
            throw new Error('Collection contains more than one match!');
        }

        return results[0] || null;
    }
}