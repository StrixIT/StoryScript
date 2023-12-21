import { Location, IGame } from '../../types';
import description from './Stonemount.html';
import { Wolf } from '../../enemies/Wolf';
import { Start } from './start';

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
            Wolf()
        ],
        actions: [
            {
                text: 'Search the stone mount',
                execute: (game: IGame) => {
                    game.character.currency += 35;
                    game.logToLocationLog(game.currentLocation.descriptions['search']);
                }
            }
        ]
    });
}