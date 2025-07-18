import {IGame, Location} from '../../types';
import description from './Brennus.html?raw';
import {Brennus as BrennusEnemy} from '../../enemies/Brennus';
import {Start} from './start';
import {locationComplete} from "../../sharedFunctions.ts";
import {backToForestText} from "../../explorationRules.ts";

export function Brennus() {
    return Location({
        name: 'Brennus',
        description: description,
        picture: true,
        destinations: [
            {
                name: backToForestText,
                target: Start
            }
        ],
        enemies: [
            BrennusEnemy()
        ],
        leaveEvents:
            [[
                'Leave',
                (game: IGame) => {
                    locationComplete(game, game.currentLocation, () => game.currentLocation.enemies.length == 0, () => game.currentLocation.enemies.length == 0);
                    return true;
                }
            ]],
        actions:
            [[
                'Approach',
                {
                    text: 'Approach the Tent',
                    execute: (game: IGame) => {
                        game.currentLocation.descriptionSelector = 'approach';
                        game.currentLocation.enemies.forEach(e => {
                            e.activeNight = true;
                            e.inactive = false;
                        });
                    },
                    activeNight: true
                }
            ]]
    });
}