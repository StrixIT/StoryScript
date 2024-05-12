import { IDefinitions } from './Interfaces/definitions';
import { compareString, recordKeyPropertyName } from './globals';
import { GameState, IGame, ILocation, PlayState } from './Interfaces/storyScript';
import { StateList, StateListEntry } from './Interfaces/stateList';

export function compare(a: any, b: any) {
    if (a > b) return +1;
    if (a < b) return -1;
    return 0;
}

export function getId(id: Function | string) {
    let actualId: string;

    if (typeof id === 'function') {
        actualId = id.name;
        let nameParts = actualId.split('_');
    
        // This is a workaround with function names changing when building for production.
        // E.g. Start becomes Start_Start.
        /* v8 ignore next 3 */
        if (nameParts.length > 1) {
            actualId = nameParts[0];
        }
    } 
    else {
        actualId = id;
    }

    return actualId?.toLowerCase();
}

export function getKeyPropertyNames(item: any) {
    if (typeof item === 'undefined') {
        return {};
    }

    let firstKeyProperty = item.id !== undefined ? 'id' : item.name !== undefined ? 'name' : item.text !== undefined ? 'text' : item.tool !== undefined ? 'tool' : null;
    const secondKeyProperty =  item.type !== undefined ? 'type' : item.target !== undefined ? 'target' : item.text !== undefined ? 'text' : item.combinationType !== undefined ? 'combinationType' : null;

    return { first: firstKeyProperty, second: secondKeyProperty };
}

export function propertyMatch(first: any, second: any): boolean {
    if (typeof first === 'undefined' || typeof second === 'undefined') {
        return false;
    }

    let { first: firstProperty, second: secondProperty } = getKeyProperties(first, second);

    if (firstProperty && secondProperty) {
        return (firstProperty && getValue(first[firstProperty]) === getValue(second[firstProperty]))
        && (secondProperty && getValue(first[secondProperty]) === getValue(second[secondProperty]));
    }

    if (firstProperty || secondProperty) {
        return (firstProperty && getValue(first[firstProperty]) === getValue(second[firstProperty])) ||
        (secondProperty && getValue(first[secondProperty]) === getValue(second[secondProperty]));
    }

    // This is to match deleted record entries.
    firstProperty = Object.keys(first)[0];
    secondProperty = Object.keys(second)[0];
    const isRecord = first[firstProperty] === recordKeyPropertyName || second[secondProperty] === recordKeyPropertyName; 

    return isRecord ? Object.keys(first)[0] === Object.keys(second)[0] : false;
}

function getKeyProperties(current: any, pristine: any): { first: string, second: string } {
    const { first: currentFirst, second: currentSecond } = getKeyPropertyNames(current);
    const { first: pristineFirst, second: pristineSecond } = getKeyPropertyNames(pristine);
    return { first: currentFirst ?? pristineFirst, second: currentSecond ?? pristineSecond };
}

export function getValue(value: any): string {
    return typeof value === 'function' ? value.name.toLowerCase() : value;
}

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

export function random<T>(type: string, definitions: IDefinitions, selector?: (item: T) => boolean): T {
    var collection = definitions[type];

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

export function randomList<T>(collection: T[] | ([() => T]), count: number, type: string, definitions: IDefinitions, selector?: (item: T) => boolean): T[] {
    var selection = getFilteredInstantiatedCollection<T>(collection, selector);
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

export function equals<T extends { id?: string }>(entity: T, definition: () => T): boolean {
    return entity.id ? compareString(entity.id, definition.name) : false;
}

export function clone<T>(entity: T): T {
    return extend(Array.isArray(entity) ? Array(entity.length).fill({}) : {}, entity);
}

export function parseGameProperties(lines: string, game: IGame): string {
    const propertyRegex = /{(?:[a-zA-Z\[\]0-9]{1,}[.]{0,1}){1,}}/g;
    const indexRegex = /\[[0-9]{1,}\]/g;
    let result = lines;
    let parseMatch = null;

    while ((parseMatch = propertyRegex.exec(lines)) !== null)
    {
        let property = <unknown>game;
        let replacement = parseMatch[0];
        let index = null;
        let propertyFound = false;

        parseMatch[0].replace(/{|}/g, '').split('.').forEach((e: string) => {
            if (index = indexRegex.exec(e)) {
                e = e.replace(index, '');
                index = parseInt(index[0].replace(/\[|\]/g, ''));
            }

            if (property.hasOwnProperty(e)) {
                property = property[e];
                propertyFound = true;
            }
            else {
                propertyFound = false;
            }

            if (!isNaN(index) && Array.isArray(property)) {
                property = property[index];
            }
        }); 

        if (propertyFound) {
            replacement = property;
        }

        lines = lines.replace(`${parseMatch[0]}`, '');
        result = result.replace(`${parseMatch[0]}`, replacement);
    }

    return result;
}

export function createPromiseForCallback<T>(callBack: Function): { promise: Promise<T>, promiseCallback : () => void } {
    let resolveFunc = null;

    const promiseCallback = () => { 
        var callBackResult = callBack();
        Promise.resolve(callBackResult).then(() => {
            resolveFunc?.();
        });
     }

    const promiseFunc = function(resolve, reject) {
        resolveFunc = resolve;
    }

    const promise = new Promise<T>(promiseFunc);

    return { promise, promiseCallback };              
}

export function wait(timeInMs: number, callBack: Function): Promise<void> {
    const { promise, promiseCallback } = createPromiseForCallback<void>(callBack);

    setTimeout(() => {
        promiseCallback();
    }, timeInMs);

    return promise;
}

export function interval(intervalTimeInMs: number, repeat: number, intervalCallback: Function, finalCallback?: Function): Promise<void> {
    const { promise, promiseCallback } = createPromiseForCallback<void>(finalCallback ?? (() => {}));

    let count = 0;

    const interval = setInterval(() => {
        count++;
        intervalCallback();

        if (count >= repeat) {
            clearInterval(interval);

            if (finalCallback) {
                setTimeout(() => {
                    promiseCallback();
                }, intervalTimeInMs);
            }
            else {
                promiseCallback();
            }
        }
    }, intervalTimeInMs);

    return promise;
}

export function selectStateListEntry(game: IGame, stateList: StateList) {
            // Evaluate custom functions first.
            var customFunctions = stateList[''];
            let result = null;
    
            for (var n in customFunctions) {
                result = (<((game: IGame) => string)><unknown>customFunctions[n])(game);
    
                if (result) {
                    return result;
                }
            }
    
            // Next, get the entries in this order: Location, PlayState, GameState.
            var filteredEntries = Object.keys(stateList)
                                    .map(e => mapPlaylistEntries(game, e, stateList[e]))
                                    .filter(e => e);
            
            result = filteredEntries.map(e => selectCandidate(game, e.key, e.item))
                .filter(i => i.order > 0)
                .sort((a, b) => a.order - b.order)[0];
    
            return result?.key;
}

function mapPlaylistEntries(game: IGame, key: string, entry: StateListEntry) {
    return entry.map(i => selectCandidate(game, key, i))
        .filter(i => i.order > 0)
        .sort((a, b) => a.order - b.order)[0];
}

function selectCandidate(game: IGame, key: string, item: (GameState | PlayState | (() => ILocation) | ((game: IGame) => string) | string)) {
    const functionName = (<Function>item)?.name;
    const currentLocationId = game.currentLocation?.id;

    var order = item === game.state ? 3 
    : item ===  game.playState ? 2 
    : functionName && currentLocationId && compareString(functionName, currentLocationId) ? 1 
    : 0;

    return { key, item, order };
}

function getFilteredInstantiatedCollection<T>(collection: T[] | (() => T)[], selector?: (item: T) => boolean) {
    var collectionToFilter = <T[]>[];

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
    const keys = Object.keys(source);

    for (let i = 0, ii = keys.length; i < ii; ++i) {
        const key = keys[i];
        const obj = source[key];
        const isArray = Array.isArray(obj);
        
        if (target[key] === undefined) {
            target[key] = isArray ? [] : null;
        }
        
        target[key] = Array.isArray(obj) ? extend(Array(obj.length).fill({}), obj) : typeof obj === 'object' ? extend({}, obj) : obj;
    }

    return target;
}