import { Location, IGame } from '../../types';
import description from './Stonemount.html';
import { Wolf } from '../../enemies/Wolf';
import { Start } from './start';
import { GhostBandit } from '../../enemies/GhostBandit';
import { locationComplete } from '../../gameFunctions';

export function Stonemount() {
    return Location({
        name: 'The Stone Mount',
        description: description,
        destinations: [
            {
                name: 'Back to the Map',
                target: Start
            },             
        ],
        enemies: [
            Wolf(),
            Wolf(),
            GhostBandit()
        ],
        actions: [
            {
                text: 'Search the stone mount',
                execute: (game: IGame) => {
                    game.character.currency += 35;
                    game.logToLocationLog(game.currentLocation.descriptions['search']);
                },
                activeNight: true
            }
        ],
        leaveEvents: [
            {
                'Leave':
                (game: IGame) => {
                    locationComplete(game, game.currentLocation, () => game.currentLocation.enemies.length == 0, () => game.currentLocation.actions.length == 0);
                    return true;
                }
            }
        ]
    });
}