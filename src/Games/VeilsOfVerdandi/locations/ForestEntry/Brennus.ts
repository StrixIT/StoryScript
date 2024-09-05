import {IGame, Location} from '../../types';
import description from './Brennus.html?raw';
import {Brennus as BrennusEnemy} from '../../enemies/Brennus';
import {Start} from './start';
import {locationComplete} from "../../sharedFunctions.ts";

export function Brennus() {
    return Location({
        name: 'Brennus',
        description: description,
        destinations: [
            {
                name: 'To the Forest Entry',
                target: Start
            }
        ],
        enemies: [
            BrennusEnemy()
        ],
        enterEvents:
            [[
                'Night',
                (game: IGame) => {
                    if (game.worldProperties.isNight) {
                        game.currentLocation.enemies.map(e => e.inactive = true);
                    }
                }
            ]],
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
                        game.currentLocation.enemies.map(e => e.inactive = false);
                    },
                    activeNight: true
                }
            ]]
    });
}