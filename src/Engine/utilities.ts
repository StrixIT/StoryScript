import { IDefinitions } from './Interfaces/definitions';

export function getPlural(name: string): string {
    return name.endsWith('y') ? 
            name.substring(0, name.length - 1) + 'ies' 
            : name.endsWith('s') ? 
                name 
                : name + 's';
}

export function getSingular(name: string): string {
    return name.endsWith('ies') ? 
            name.substring(0, name.length - 3) + 'y' 
            : name.endsWith('e') ? name
                : name.substring(0, name.length - 1);
}

export function addHtmlSpaces(text: string): string {
    if (!text) {
        return null;
    }

    if (text.substr(0, 1).trim() !== '' && text.substr(0, 6) !== '&nbsp;') {
        text = '&nbsp;' + text;
    }

    if (text.substr(text.length - 1, 1).trim() !== '' && text.substr(text.length - 6, 6) !== '&nbsp;') {
        text = text + '&nbsp;';
    }

    return text;
}

export function isEmpty(object: any, property?: string) {
    var objectToCheck = property ? object[property] : object;
    return objectToCheck ? Array.isArray(objectToCheck) ? objectToCheck.length === 0 : Object.keys(objectToCheck).length === 0 : true;
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

export function random<T>(type: string, definitions: IDefinitions, selector?: (item: T) => boolean): T {
    var collection = definitions[type];

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

export function randomList<T>(collection: T[] | ([() => T]), count: number, type: string, definitions: IDefinitions, selector?: (item: T) => boolean): T[] {
    var selection = getFilteredInstantiatedCollection<T>(collection, type, definitions, selector);
    var results = <T[]>[];

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

export function custom<T>(definition: () => T, customData: {}): T {
    var instance = definition();
    return extend(instance, customData);
}

export function equals<T extends { id?: string }>(entity: T, definition: () => T): boolean {
    return entity.id ? entity.id === (definition.name) : false;
}

function getFilteredInstantiatedCollection<T>(collection: T[] | (() => T)[], type: string, definitions: IDefinitions, selector?: (item: T) => boolean) {
    var collectionToFilter = <T[]>[]

    if (typeof collection[0] === 'function') {
        (<[() => T]>collection).forEach((def: () => T) => {
            collectionToFilter.push(def());
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