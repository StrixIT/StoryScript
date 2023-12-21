import { Location, IGame } from '../types';
import description from './ForestLake.html';
import { Start } from './ForestOfMyrr/start';
import { Bandit } from '../enemies/Bandit';
import { Ghost } from '../enemies/Ghost';
import { Goldnecklace } from '../items/Goldnecklace';
import { locationComplete } from '../gameFunctions';

export function ForestLake() {
    return Location({
        name: 'Forest Lake',
        description: description,
        destinations: [
            {
                name: 'The Forest Entry',
                target: Start
            }
        ],
        enemies: [
            Bandit(),
            Bandit(),
            Ghost()
        ],
        items: [
            Goldnecklace()
        ],
        leaveEvents: [
            (game: IGame) => {
                locationComplete(game, game.currentLocation, () => game.currentLocation.activeEnemies.length == 0, () => game.currentLocation.items.length == 0);
                return true;
            }
        ]
    });
}