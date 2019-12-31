import { IGame } from '../Interfaces/game';
import { DataKeys } from '../DataKeys';
import { IDataService } from '../Interfaces/services/dataService';
import { ILocationService } from '../Interfaces/services/locationService';

export function SaveWorldState(dataService: IDataService, locationService: ILocationService, game: IGame) {
    dataService.save(DataKeys.CHARACTER, game.character);
    dataService.save(DataKeys.STATISTICS, game.statistics);
    dataService.save(DataKeys.WORLDPROPERTIES, game.worldProperties);
    locationService.saveWorld(game.locations);
}

export function getParsedDocument(tag: string, value?: string) {
    if (!value) {
        return null;
    }

    var parser = new DOMParser();
    var htmlDoc = parser.parseFromString(value, 'text/html');
    return htmlDoc.getElementsByTagName(tag);
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