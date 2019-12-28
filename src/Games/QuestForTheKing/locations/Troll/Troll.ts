import { Location, IGame } from '../../types';
import description from './Troll.html';
import { Troll as TrollEnemy } from '../../enemies/Troll';
import { Quest1map3 } from '../Maps/Quest1map3';

export function Troll() {
    return Location({
        name: 'The Troll',
        description: description,
        destinations: [
            {
                name: 'Back to the Map',
                target: Quest1map3
            }
        ],
        enemies: [
            TrollEnemy()          
        ],
        actions: [
            {
                text: 'Open the cage',
                execute: (game: IGame) => {
                    game.logToLocationLog(game.currentLocation.descriptions['opencage']);
                    game.worldProperties.freedFaeries = true;
                }
            }
        ]
    });
}