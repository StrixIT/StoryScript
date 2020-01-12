import { IGame } from '../Interfaces/game';
import { DataKeys } from '../DataKeys';
import { IDataService } from '../Interfaces/services/dataService';
import { ILocationService } from '../Interfaces/services/locationService';
import { ICharacter } from '../Interfaces/character';
import { IItem } from '../Interfaces/item';
import { IRules } from '../Interfaces/rules/rules';

export function SaveWorldState(dataService: IDataService, locationService: ILocationService, game: IGame, rules: IRules) {
    if (rules.general.beforeSave) {
        rules.general.beforeSave(game);
    }

    dataService.save(DataKeys.CHARACTER, game.character);
    dataService.save(DataKeys.STATISTICS, game.statistics);
    dataService.save(DataKeys.WORLDPROPERTIES, game.worldProperties);
    locationService.saveWorld(game.locations);

    if (rules.general.afterSave) {
        rules.general.afterSave(game);
    }
}

export function getParsedDocument(tag: string, value?: string, wrapIfNotFound?: boolean) {
    if (!value) {
        return null;
    }

    var parser = new DOMParser();
    var htmlDoc = parser.parseFromString(value, 'text/html');

    var elements = htmlDoc.getElementsByTagName(tag);

    if (!elements.length && wrapIfNotFound) {
        value = `<${tag}>${value}</${tag}>`;
        htmlDoc = parser.parseFromString(value, 'text/html');
        elements = htmlDoc.getElementsByTagName(tag);
    }

    return elements;
}

export function checkAutoplay(dataService: IDataService, value: string) {
    // Check media with the autoplay property to play only once.
    var descriptionDocument = new DOMParser().parseFromString(value, 'text/html');
    var playedAudio = dataService.load<string[]>(DataKeys.PLAYEDMEDIA) || [];
    value = checkAutoplayProperties(value, descriptionDocument.getElementsByTagName('audio'), playedAudio);
    value = checkAutoplayProperties(value, descriptionDocument.getElementsByTagName('video'), playedAudio);
    dataService.save(DataKeys.PLAYEDMEDIA, playedAudio);
    return value;
}

export function removeItemFromItemsAndEquipment(character: ICharacter, item: IItem) {
    character.items.remove(item);

    if (character.equipment) {
        for (var n in character.equipment) {
            if (item === character.equipment[n]) {
                character.equipment[n] = null;
            }
        };
    }
}

function checkAutoplayProperties(value: string, elements: HTMLCollectionOf<HTMLElement>, playedAudio: string[]) {
    Array.from(elements).forEach(e => {
        var originalText = e.outerHTML;
        var source = e.getElementsByTagName('source')?.[0].getAttribute('src')?.toLowerCase();

        if (originalText && source) {
            if (playedAudio.indexOf(source) < 0) {
                playedAudio.push(source);
            } 
            else {
                e.removeAttribute('autoplay');
                value = value.replace(originalText, e.outerHTML);
            }
        }
    });

    return value;
}