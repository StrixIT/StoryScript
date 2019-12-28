import { Location, IGame } from '../../types';
import description from './Stonemount.html';
import { Quest1map1 } from '../Maps/Quest1map1';
import { Wolf } from '../../enemies/Wolf';

export function Stonemount() {
    return Location({
        name: 'The Stone Mount',
        description: description,
        destinations: [
            {
                name: 'Back to the Map',
                target: Quest1map1
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