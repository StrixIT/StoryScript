namespace StoryScript {
    export function isEmpty(object: any, property?: string) {
        var objectToCheck = property ? object[property] : object;
        return objectToCheck ? Array.isArray(objectToCheck) ? objectToCheck.length === 0 : Object.keys(objectToCheck).length === 0 : true;
    }

    export function createReadOnlyCollection(entity: any, propertyName: string, collection: { id?: string, type?: string }[]) {
        Object.defineProperty(entity, propertyName, {
            enumerable: true,
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

    export function random<T, U>(type: string, definitions: IDefinitions, selector?: (item: T) => boolean): U {
        var collection = definitions[type];

        if (!collection) {
            return null;
        }

        var selection = getFilteredInstantiatedCollection<T>(collection, type, definitions, selector);

        if (selection.length == 0) {
            return null;
        }

        var index = Math.floor(Math.random() * selection.length);
        return <U><unknown>selection[index];
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

    export function find<T, U>(selector: string | (() => T) | ((item: T) => boolean), type: string, definitions: IDefinitions): U {
        var collection = definitions[type];

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

                return match[0] ? <U><unknown>definitionToObject(match[0]) : null;
            }
        }

        var results = getFilteredInstantiatedCollection<T>(collection, type, definitions, <(item: T) => boolean>selector);

        if (results.length > 1) {
            throw new Error('Collection contains more than one match!');
        }

        return results[0] ? <U><unknown>results[0] : null;
    }

    export function addProxy(entry: any, collectionType: string) {
        var definitions = window.StoryScript.ObjectFactory.GetDefinitions();

        if (collectionType === 'enemy') {
            entry.enemies.push = entry.enemies.push.proxy(function (push: Function, selector: string | (() => IEnemy)) {
                var enemy: ICompiledEnemy = null;

                if (typeof selector !== 'object') {
                    enemy = find(selector, 'enemies', definitions);
                }
                else {
                    enemy = selector;
                }

                push.call(this, enemy);
            });
        }
        
        if (collectionType === 'item') {
            entry.items.push = entry.items.push.proxy(function (push: Function, selector: string | (() => IItem)) {
                var item: IItem = null;

                if (typeof selector !== 'object') {
                    item = find(selector, 'items', definitions);
                }
                else {
                    item = selector;
                }

                push.call(this, item);
            });
        }

        if (collectionType == 'feature') {
            entry.features.push = entry.features.push.proxy(function (push: Function, selector: string | (() => IFeature)) {
                var feature = CompileFeature(selector);
                push.call(this, feature);
            });
        }
    }

    export function custom<T>(definition: () => T, customData: {}): () => T {
        return (): T => {
            var instance = definition();
            return extend(instance, customData);
        };
    }

    export function equals<T>(entity: T, definition: () => T): boolean {
        return (<any>entity).id === (<any>definition).name;
    }

    // Taken from https://stackoverflow.com/questions/15308371/custom-events-model-without-using-dom-events-in-javascript.
    export function EventTarget(options: any): void {
        // Create a DOM EventTarget object
        var target = document.createTextNode(null);
        // Pass EventTarget interface calls to DOM EventTarget object
        this.addEventListener = target.addEventListener.bind(target);
        this.removeEventListener = target.removeEventListener.bind(target);
        this.dispatchEvent = target.dispatchEvent.bind(target);
    }

    function getFilteredInstantiatedCollection<T>(collection: T[] | (() => T)[], type: string, definitions: IDefinitions, selector?: (item: T) => boolean) {
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

    function extend(target, source) {
        if (!source.length) {
            source = [source];
        }

        for (var i = 0, ii = source.length; i < ii; ++i) {
            var obj = source[i];

            if (!(obj !== null && typeof obj === 'object') && typeof obj !== 'function')
            {
                continue;
            }

            var keys = Object.keys(obj);
            
            for (var j = 0, jj = keys.length; j < jj; j++) {
                var key = keys[j];
                var src = obj[key];
                target[key] = src;
            }
        }

        return target;
    }
}