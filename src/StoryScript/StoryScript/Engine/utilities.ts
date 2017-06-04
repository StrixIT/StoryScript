module StoryScript {
    export function isEmpty(object: any, property?: string) {
        var objectToCheck = property ? object[property] : object;
        return objectToCheck ? Object.keys(objectToCheck).length === 0 : true;
    }

    export function definitionToObject<T>(definition: () => T, type: string, definitions: IDefinitions): T {
        var instance = definition();

        // Need to cast to any for ES5 and lower
        (<any>instance).id = (<any>definition).name;

        // Add the type to the object so we can distinguish between them in the combine functionality.
        (<any>instance).type = type.charAt(type.length - 1) === 's' ? type.substring(type.length - 3) === 'ies' ? type.substring(0, type.length - 3) + 'y' : type.substring(0, type.length - 1) : type;

        addFunctionIds(instance, type, getDefinitionKeys(definitions));

        return instance;
    }

    export function createReadOnlyCollection(entity: any, propertyName: string, collection: { id?: string, type?: string }[]) {
        Object.defineProperty(entity, propertyName, {
            get: function () {
                return collection;
            },
            set: function () {
                var type = entity.type ? entity.type : null;
                var messageStart = 'Cannot set collection ' + propertyName;
                var message = type ? messageStart + ' on type ' + type : messageStart + '.';
                throw new Error(message);
            }
        });
    }

    export function getDefinitionKeys(definitions: IDefinitions) {
        var definitionKeys: string[] = [];

        for (var i in definitions) {
            if (i !== 'actions') {
                definitionKeys.push(i);
            }
        }

        return definitionKeys;
    }

    export function addFunctionIds(entity: any, type: string, definitionKeys: string[], path?: string) {
        if (!path) {
            path = entity.id || entity.name;
        }

        for (var key in entity) {
            if (!entity.hasOwnProperty(key)) {
                continue;
            }

            if (definitionKeys.indexOf(key) != -1 || key === 'target') {
                continue;
            }

            var value = entity[key];

            if (value == undefined) {
                return;
            }
            else if (typeof value === "object") {
                addFunctionIds(entity[key], type, definitionKeys, getPath(value, key, path, definitionKeys));
            }
            else if (typeof value == 'function' && !value.isProxy) {
                var functionId = path ? path + '_' + key : key;
                value.functionId = 'function#' + type + '_' + functionId + '#' + createFunctionHash(value);
            }
        }
    }

    function getPath(value, key: string, path: string, definitionKeys: string[]): string {
        if (definitionKeys.indexOf(key) != -1) {
            path = key;
        }
        else if (definitionKeys.indexOf(path) != -1 && !isNaN(parseInt(key))) {

        }
        else {
            path = path === undefined ? key : path + '_' + key;
        }

        if (value.id) {
            path = path + '_' + value.id;
        }

        return path;
    }

    export function random<T>(collection: T[] | ([() => T]), type: string, definitions: IDefinitions, selector?: (item: T) => boolean): T {
        if (!collection) {
            return null;
        }

        var selection = getFilteredInstantiatedCollection<T>(collection, type, definitions, selector);

        if (selection.length == 0) {
            return null;
        }

        var index = Math.floor(Math.random() * selection.length);
        return selection[index];
    }

    export function randomList<T>(collection: T[] | ([() => T]), count: number, type: string, definitions: IDefinitions, selector?: (item: T) => boolean): ICollection<T> {
        var selection = getFilteredInstantiatedCollection<T>(collection, type, definitions, selector);
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

    export function find<T>(collection: T[] | ([() => T]), selector: string | (() => T) | ((item: T) => boolean), type: string, definitions: IDefinitions): T {
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

                return match[0] ? definitionToObject(match[0], type, definitions) : null;
            }
        }

        var results = getFilteredInstantiatedCollection<T>(collection, type, definitions, <(item: T) => boolean>selector);

        if (results.length > 1) {
            throw new Error('Collection contains more than one match!');
        }

        return results[0] ? results[0] : null;
    }

    function getFilteredInstantiatedCollection<T>(collection: T[] | ([() => T]), type: string, definitions: IDefinitions, selector?: (item: T) => boolean) {
        var collectionToFilter = <T[]>[]

        if (typeof collection[0] === 'function') {
            (<[() => T]>collection).forEach((def: () => T) => {
                collectionToFilter.push(definitionToObject(def, type, definitions));
            });
        }
        else {
            collectionToFilter = <T[]>collection;
        }

        return selector ? collectionToFilter.filter(selector) : collectionToFilter;
    }
}