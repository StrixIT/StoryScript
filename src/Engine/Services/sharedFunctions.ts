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