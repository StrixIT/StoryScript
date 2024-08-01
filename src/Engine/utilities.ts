import {IDefinitions} from './Interfaces/definitions';
import {compareString} from './globals';
import {GameState, IGame, ILocation, PlayState} from './Interfaces/storyScript';
import {StateList, StateListEntry} from './Interfaces/stateList';

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
    } else {
        actualId = id;
    }

    return actualId?.toLowerCase();
}

export function isDataRecord(item: any[]): boolean {
    // Check for either object or function values, as tuples are used to store actions as objects and functions now.
    return item?.length && item.length === 2 && typeof (item[0]) === 'string' && (typeof (item[1]) === 'object' || typeof (item[1]) === 'function');
}

export function getKeyPropertyNames(item: any): { first: string, second: string } {
    if (typeof item === 'undefined') {
        return {first: null, second: null};
    }

    if (isDataRecord(item)) {
        return {first: '0', second: null};
    }

    let firstKeyProperty = item.id !== undefined ? 'id' : null;
    firstKeyProperty ??= item.target !== undefined ? 'target' : null;
    firstKeyProperty ??= item.tool !== undefined ? 'tool' : null;
    let secondKeyProperty = item.type !== undefined ? 'type' : null;
    secondKeyProperty ??= item.combinationType !== undefined ? 'combinationType' : null;

    return {first: firstKeyProperty, second: secondKeyProperty};
}

export function propertyMatch(first: any, second: any): boolean {
    if (typeof first === 'undefined' || typeof second === 'undefined') {
        return false;
    }

    let {first: firstProperty, second: secondProperty} = getKeyProperties(first, second);

    if (firstProperty && secondProperty) {
        return getValue(first[firstProperty]) === getValue(second[firstProperty])
            && getValue(first[secondProperty]) === getValue(second[secondProperty]);
    }

    if (firstProperty || secondProperty) {
        return (firstProperty && getValue(first[firstProperty]) === getValue(second[firstProperty])) ||
            (secondProperty && getValue(first[secondProperty]) === getValue(second[secondProperty]));
    }

    return false;
}

export function getPlural(name: string): string {
    let plural: string;

    if (name.endsWith('y')) {
        plural = name.substring(0, name.length - 1) + 'ies';
    } else if (name.endsWith('s')) {
        plural = name;
    } else {
        plural = name + 's';
    }

    return plural;
}

export function getSingular(name: string): string {
    let singular: string;

    if (name.endsWith('ies')) {
        singular = name.substring(0, name.length - 3) + 'y';
    } else if (name.endsWith('e')) {
        singular = name
    } else {
        singular = name.substring(0, name.length - 1);
    }

    return singular;
}

export function addHtmlSpaces(text: string): string {
    if (!text) {
        return null;
    }

    if (text.substring(0, 1).trim() !== '' && !text.startsWith('&nbsp;')) {
        text = '&nbsp;' + text;
    }

    if (text.substring(text.length - 1, 1).trim() !== '' && text.substring(text.length - 6, 6) !== '&nbsp;') {
        text = text + '&nbsp;';
    }

    return text;
}

export function isEmpty(object: any, property?: string) {
    const objectToCheck = property ? object[property] : object;

    if (objectToCheck) {
        return Array.isArray(objectToCheck) ? objectToCheck.length === 0 : Object.keys(objectToCheck).length === 0;
    }

    return true;
}

export function random<T>(type: string, definitions: IDefinitions, selector?: (item: T) => boolean): T {
    const collection = definitions[type];

    if (!collection) {
        return null;
    }

    const selection = getFilteredInstantiatedCollection<T>(collection, selector);

    if (selection.length == 0) {
        return null;
    }

    const index = Math.floor(Math.random() * selection.length);
    return selection[index];
}

export function randomList<T>(collection: T[] | ([() => T]), count: number, selector?: (item: T) => boolean): T[] {
    const selection = getFilteredInstantiatedCollection<T>(collection, selector);
    const results = <T[]>[];

    if (count === undefined) {
        count = selection.length;
    }

    if (selection.length > 0) {
        while (results.length < count && results.length < selection.length) {
            const index = Math.floor(Math.random() * selection.length);

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

export function parseGameProperties(lines: string, game: IGame): string {
    const propertyRegex = /{(?:[a-zA-Z\[\]0-9]{1,}[.]{0,1}){1,}}/g;
    const indexRegex = /\[[0-9]{1,}\]/g;
    let result = lines;
    let parseMatch = null;

    while ((parseMatch = propertyRegex.exec(lines)) !== null) {
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
            } else {
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

export function createPromiseForCallback<T>(callBack: Function): { promise: Promise<T>, promiseCallback: () => void } {
    let resolveFunc = null;

    const promiseCallback = () => {
        const callBackResult = callBack();
        Promise.resolve(callBackResult).then(() => {
            resolveFunc?.();
        });
    }

    const promiseFunc = function (resolve: any) {
        resolveFunc = resolve;
    }

    const promise = new Promise<T>(promiseFunc);

    return {promise, promiseCallback};
}

export function wait(timeInMs: number, callBack: Function): Promise<void> {
    const {promise, promiseCallback} = createPromiseForCallback<void>(callBack);

    setTimeout(() => {
        promiseCallback();
    }, timeInMs);

    return promise;
}

export function interval(intervalTimeInMs: number, repeat: number, intervalCallback: Function, finalCallback?: Function): Promise<void> {
    const {promise, promiseCallback} = createPromiseForCallback<void>(finalCallback ?? (() => {
    }));

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
            } else {
                promiseCallback();
            }
        }
    }, intervalTimeInMs);

    return promise;
}

export function selectStateListEntry(game: IGame, stateList: StateList) {
    // Evaluate custom functions first.
    const customFunctions = stateList[''];
    let result = null;

    for (const n in customFunctions) {
        result = (<((game: IGame) => string)><unknown>customFunctions[n])(game);

        if (result) {
            return result;
        }
    }

    // Next, get the entries in this order: Location, PlayState, GameState.
    const filteredEntries = Object.keys(stateList)
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

function getKeyProperties(pristine: any, current: any): { first?: string, second?: string } {
    const {first: pristineFirst, second: pristineSecond} = getKeyPropertyNames(pristine);
    const {first: currentFirst, second: currentSecond} = getKeyPropertyNames(current);
    return {
        first: pristineFirst && currentFirst ? pristineFirst : null,
        second: pristineSecond && currentSecond ? pristineSecond : null
    };
}

function getValue(value: any): string {
    return typeof value === 'function' ? value.name.toLowerCase() : value;
}

function selectCandidate(game: IGame, key: string, item: (GameState | PlayState | (() => ILocation) | ((game: IGame) => string) | string)) {
    const functionName = (<Function>item)?.name;
    const currentLocationId = game.currentLocation?.id;

    const order = item === game.state ? 3
        : item === game.playState ? 2
            : functionName && currentLocationId && compareString(functionName, currentLocationId) ? 1
                : 0;

    return {key, item, order};
}

function getFilteredInstantiatedCollection<T>(collection: T[] | (() => T)[], selector?: (item: T) => boolean) {
    let collectionToFilter = <T[]>[];

    if (typeof collection[0] === 'function') {
        (<[() => T]>collection).forEach((def: () => T) => {
            collectionToFilter.push(def());
        });
    } else {
        collectionToFilter = <T[]>collection;
    }

    return selector ? collectionToFilter.filter(selector) : collectionToFilter;
}