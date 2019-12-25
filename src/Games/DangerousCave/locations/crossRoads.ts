import { IGame, Location } from '../types';
import description from './crossRoads.html'
import { DarkCorridor } from './darkCorridor';
import { Temp } from './temp';
import { WestCrossing } from './westCrossing';
import { RightCorridor } from './rightCorridor';

export function CrossRoads() {
    return Location({
        name: 'Een kruispunt',
        description: description,
        enterEvents: [
            (game: IGame) => {
                var orkCorridor = game.locations.get(DarkCorridor);
                var orkPresent = !orkCorridor.hasVisited;

                if (game.character.oplettendheid > 2 && orkPresent) {
                    game.logToLocationLog('Je hoort vanuit de westelijke gang een snuivende ademhaling.');
                }
            }
        ],
        destinations: [
            {
                name: 'Donkere tunnel (oost)',
                target: DarkCorridor
            },
            {
                name: 'Nog niet! Gang (noord)',
                target: Temp
            },
            {
                name: 'Donkere tunnel (west)',
                target: WestCrossing
            },
            {
                name: 'Gang (zuid)',
                target: RightCorridor
            }
        ],
    });
}