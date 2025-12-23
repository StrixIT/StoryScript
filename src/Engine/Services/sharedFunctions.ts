import {ICharacter} from '../Interfaces/character';
import {IItem} from '../Interfaces/item';
import {IParty} from '../Interfaces/party';
import {IGame} from "storyScript/Interfaces/game.ts";
import {IDefinitions} from "storyScript/Interfaces/definitions.ts";
import {StateList, StateListEntry} from "storyScript/Interfaces/stateList.ts";
import {GameState} from "storyScript/Interfaces/enumerations/gameState.ts";
import {PlayState} from "storyScript/Interfaces/enumerations/playState.ts";
import {ILocation} from "storyScript/Interfaces/location.ts";
import {compareString, parseHtmlDocumentFromString} from "storyScript/utilityFunctions.ts";
import {getParsedDocument} from "storyScript/EntityCreatorFunctions.ts";
import {DescriptionProperty} from "../../../constants.ts";

const parsedDescriptions = new Map<string, boolean>();

export function hasDescription(entity: { id?: string, description?: string }): boolean {
    if (!entity.description) {
        return false;
    }

    if (!parsedDescriptions.get(entity.id)) {
        const descriptionNode = getParsedDocument(DescriptionProperty, entity.description)[0];
        parsedDescriptions.set(entity.id, descriptionNode?.innerHTML?.trim() !== '');
    }

    return parsedDescriptions.get(entity.id);
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
 * This function creates a new function with the callback embedded. This makes the new function safe for serialization.
 * @param functionDefinition The main function to make safe for serialization.
 * @param callback The callback function to embed.
 * @returns The main function with the callback embedded.
 */
export function makeSerializeSafe<T extends Function>(functionDefinition: T, callback: Function): T {
    let serialized = serializeFunction(functionDefinition);

    if (callback) {
        const functionSignature = /function(\((?:[a-zA-Z]+[, )]+)*)/.exec(serialized);
        const functionParams = functionSignature[1];
        const callbackSignature = Array.from(serialized.matchAll(new RegExp('([a-zA-z]+)[\?\.]{0,2}\\(' + functionParams + '\\)', 'gm')))[1];

        if (callbackSignature) {
            const callbackName = callbackSignature[1];
            const startIndex = serialized.indexOf('{') + 1;
            serialized = serialized.substring(0, startIndex) + `const ${callbackName} = ${serializeFunction(callback)};` + serialized.substring(startIndex);
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

export function parseGamePropertiesInTemplate(lines: string, game?: IGame): string {
    const propertyRegex = /{(?:[a-zA-Z\[\]0-9]+[.]?)+}/g;
    const indexRegex = /\[\d+]/g;
    let result = lines;
    let parseMatch = null;

    while ((parseMatch = propertyRegex.exec(lines)) !== null) {
        let property = <unknown>game;
        let replacement = parseMatch[0];
        let index = null;
        let propertyFound = false;

        parseMatch[0].replace(/{|}/g, '').split('.').forEach((e: string) => {
            index = indexRegex.exec(e);

            if (index) {
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

export function selectStateListEntry(game: IGame, stateList: StateList) {
    // Evaluate custom functions first.
    const customFunctions = stateList[''];
    let result = null;

    customFunctions?.filter(f => typeof f === 'function').forEach(f => {
        result = f(game);
    })

    if (result) {
        return result;
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

export function checkAutoplay(game: IGame, value: string, autoPlayCheck?: boolean) {
    // Check media with the autoplay property to play only once.
    autoPlayCheck = autoPlayCheck ?? true;
    const htmlDocumentFromString = parseHtmlDocumentFromString(value);

    if (autoPlayCheck) {
        value = checkAutoplayProperties(value, htmlDocumentFromString.getElementsByTagName('audio'), game.sounds.playedAudio);
        value = checkAutoplayProperties(value, htmlDocumentFromString.getElementsByTagName('video'), game.sounds.playedAudio);
    }

    return value;
}

export function removeItemFromParty(party: IParty, item: IItem | (() => IItem)) {
    let deleted = false;

    party.characters.forEach(c => {
        if (deleted) {
            return;
        }

        deleted = removeItemFromItemsAndEquipment(c, item);
    });
}

export function removeItemFromItemsAndEquipment(character: ICharacter, item: IItem | (() => IItem)): boolean {
    let deleted = false;

    if (character.items.get(item)) {
        character.items.delete(item);
        deleted = true;
    }

    if (character.equipment) {
        for (const n in character.equipment) {
            if (item === character.equipment[n]) {
                character.equipment[n] = null;
                deleted = true;
            }

            if (deleted) {
                break;
            }
        }
    }

    return deleted;
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

const autoplayAttribute = 'autoplay';
const sourceAttribute = 'src';

function checkAutoplayProperties(value: string, elements: HTMLCollectionOf<HTMLElement>, playedAudio: string[]) {
    Array.from(elements).forEach(e => {
        const originalText = e.outerHTML;
        const source = e.getElementsByTagName('source')[0]?.getAttribute(sourceAttribute)?.toLowerCase()
            ?? e.getAttribute(sourceAttribute)?.toLowerCase();

        if (originalText && source && e.hasAttribute(autoplayAttribute)) {
            if (playedAudio.indexOf(source) < 0) {
                playedAudio.push(source);
            } else {
                e.removeAttribute(autoplayAttribute);
                value = value.replace(originalText, e.outerHTML);
            }
        }
    });

    return value;
}

function selectCandidate(game: IGame, key: string, item: (GameState | PlayState | (() => ILocation) | ((game: IGame) => string) | string)) {
    const functionName = (<Function>item)?.name;
    const currentLocationId = game.currentLocation?.id;
    let order: number;

    if (item === game.state) {
        order = 3;
    } else if (item === game.playState) {
        order = 2;
    } else {
        order = functionName && currentLocationId && compareString(functionName, currentLocationId) ? 1 : 0
    }

    return {key, item, order};
}