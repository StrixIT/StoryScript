import {IGame, Location} from '../../types';
import description from './ForestLake.html?raw';
import {Bandit} from '../../enemies/Bandit';
import {Goldnecklace} from '../../items/Goldnecklace';
import {Start} from './start';
import {heal, locationComplete} from "../../sharedFunctions.ts";

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