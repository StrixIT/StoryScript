import {EquipmentType, ILocation} from "./Interfaces/storyScript";
import {StateProperties} from "storyScript/stateProperties.ts";

const functionRenameRegex =  /[$_].{1,}/i;

export function compareString(left: string, right: string): boolean {
    if ((left === undefined && right === undefined) || (left === null && right === null)) {
        return true;
    } else if ((left === null || left === undefined) || (right === null || right === undefined)) {
        return false;
    }

    return left.toLowerCase() === right.toLowerCase();
}

export function getId(id: Function | string) {
    let actualId: string;

    if (typeof id === 'function') {
        // This is a workaround with function names changing when building for production.
        // E.g. Start becomes Start_Start. Since Vite 7, we also get Start becoming Start$2.
        /* v8 ignore next 3 */
        actualId = id.name.replace(functionRenameRegex, '');
    } else {
        actualId = id;
    }

    return actualId?.toLowerCase();
}

export function isDataRecord(item: any[]): boolean {
    // Check for either object or function values, as tuples are used to store actions as objects and functions now.
    return item?.length && item.length === 2 && typeof (item[0]) === 'string' && (typeof (item[1]) === 'object' || typeof (item[1]) === 'function');
}

export function getKeyPropertyNames(item: any, includeUniqueIds?: boolean): { first: string, second: string } {
    if (typeof item === 'undefined') {
        return {first: null, second: null};
    }

    if (isDataRecord(item)) {
        return {first: '0', second: null};
    }

    let firstKeyProperty = includeUniqueIds && item[StateProperties.Id] !== undefined ? <string>StateProperties.Id : null;
    firstKeyProperty ??= item.id !== undefined ? 'id' : null;
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

export function parseHtmlDocumentFromString(document: string) {
    const parser = new DOMParser();
    return parser.parseFromString(document, 'text/html');
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

export function equals<T extends { id?: string } | ILocation>(entity: T | string, definition: () => T): boolean {
    const id = (entity as { id?: string }).id ?? getId(entity as Function);
    return id ? compareString(id, definition.name) : false;
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

export function getEquipmentType(slot: EquipmentType | string): string {
    const type = EquipmentType[slot] ?? slot;
    return type.substring(0, 1).toLowerCase() + type.substring(1);
}

function getKeyProperties(pristine: any, current: any): { first?: string, second?: string } {
    const {first: pristineFirst, second: pristineSecond} = getKeyPropertyNames(pristine, true);
    const {first: currentFirst, second: currentSecond} = getKeyPropertyNames(current, true);
    return {
        first: pristineFirst && currentFirst ? pristineFirst : null,
        second: pristineSecond && currentSecond ? pristineSecond : null
    };
}

function getValue(value: any): string {
    return typeof value === 'function' ? value.name.toLowerCase() : value;
}