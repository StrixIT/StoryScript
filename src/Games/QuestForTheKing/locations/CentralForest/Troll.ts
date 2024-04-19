import { Location, IGame } from '../../types';
import description from './Troll.html';
import { Troll as TrollEnemy } from '../../enemies/Troll';

export function Troll() {
    return Location({
        name: 'The Troll',
        description: description,
        destinations: [
            {
                name: 'Back to the Map',
                target: null
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