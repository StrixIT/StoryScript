import { Location, IGame } from '../../types';
import description from './ForestLake.html?raw';
import { Bandit } from '../../enemies/Bandit';
import { Goldnecklace } from '../../items/Goldnecklace';
import { heal, locationComplete } from '../../gameFunctions';
import { Start } from './start';

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
            Bandit()
        ],
        items: [
            Goldnecklace()
        ],
        enterEvents: 
            [[
                'HealingWater',
                (game: IGame) => {
                    game.party.characters.forEach(c => {
                        heal(c, 3);
                    });
                }
            ]],
        leaveEvents:
            [[
                'Leave',
                (game: IGame) => {
                    locationComplete(game, game.currentLocation, () => game.currentLocation.activeEnemies.length == 0, () => game.currentLocation.items.length == 0);
                    return true;
                }
            ]]
    });
}