import {DataKeys} from '../DataKeys';
import {IDataService} from '../Interfaces/services/dataService';
import {ICharacter} from '../Interfaces/character';
import {IItem} from '../Interfaces/item';
import {IParty} from '../Interfaces/party';

export function getParsedDocument(tag: string, value?: string, wrapIfNotFound?: boolean) {
    if (!value) {
        return null;
    }

    const parser = new DOMParser();
    let htmlDoc = parser.parseFromString(value, 'text/html');
    let elements = htmlDoc.getElementsByTagName(tag);

    if (!elements.length && wrapIfNotFound) {
        value = `<${tag}>${value}</${tag}>`;
        htmlDoc = parser.parseFromString(value, 'text/html');
        elements = htmlDoc.getElementsByTagName(tag);
    }

    return elements;
}

export function checkAutoplay(dataService: IDataService, value: string) {
    // Check media with the autoplay property to play only once.
    const descriptionDocument = new DOMParser().parseFromString(value, 'text/html');
    const playedAudio = dataService.load<string[]>(DataKeys.PLAYEDMEDIA) || [];
    value = checkAutoplayProperties(value, descriptionDocument.getElementsByTagName('audio'), playedAudio);
    value = checkAutoplayProperties(value, descriptionDocument.getElementsByTagName('video'), playedAudio);
    dataService.save(DataKeys.PLAYEDMEDIA, playedAudio);
    return value;
}

export function removeItemFromParty(party: IParty, item: IItem) {
    let deleted = false;

    party.characters.forEach(c => {
        if (deleted) {
            return;
        }

        deleted = removeItemFromItemsAndEquipment(c, item);
    });
}

export function removeItemFromItemsAndEquipment(character: ICharacter, item: IItem): boolean {
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

function checkAutoplayProperties(value: string, elements: HTMLCollectionOf<HTMLElement>, playedAudio: string[]) {
    Array.from(elements).forEach(e => {
        const originalText = e.outerHTML;
        const source = e.getElementsByTagName('source')[0]?.getAttribute('src')?.toLowerCase()
            ?? e.getAttribute('src')?.toLowerCase();

        if (originalText && source) {
            if (playedAudio.indexOf(source) < 0) {
                playedAudio.push(source);
            } else {
                e.removeAttribute('autoplay');
                value = value.replace(originalText, e.outerHTML);
            }
        }
    });

    return value;
}