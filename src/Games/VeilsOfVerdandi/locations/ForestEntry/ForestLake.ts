import {IGame, Location} from '../../types';
import description from './ForestLake.html?raw';
import {Bandit} from '../../enemies/Bandit';
import {GoldNecklace} from '../../items/GoldNecklace.ts';
import {Start} from './start';
import {heal, locationComplete} from "../../sharedFunctions.ts";
import {backToForestText} from "../../explorationRules.ts";

export function ForestLake() {
    return Location({
        name: 'Forest Lake',
        description: description,
        destinations: [
            {
                name: backToForestText,
                target: Start
            }
        ],
        enemies: [
            Bandit(),
            Bandit()
        ],
        items: [
            GoldNecklace()
        ],
        enterEvents:
            [[
                'HealingWater',
                (game: IGame) => {
                    // Only trigger and remove this event during the day.
                    if (game.worldProperties.isNight) {
                        return true;
                    }
                    
                    game.party.characters.forEach(c => {
                        heal(c, 3);
                    });
                    
                    return false;
                }
            ]],
        leaveEvents:
            [[
                'Leave',
                (game: IGame) => {
                    locationComplete(game, game.currentLocation, () => game.currentLocation.enemies.length == 0, () => game.currentLocation.items.length == 0);
                    return true;
                }
            ]]
    });
}