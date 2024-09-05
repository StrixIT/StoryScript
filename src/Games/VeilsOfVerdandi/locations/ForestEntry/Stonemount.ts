import {IGame, Location} from '../../types';
import description from './Stonemount.html?raw';
import {Wolf} from '../../enemies/Wolf';
import {Start} from './start';
import {GhostBandit} from '../../enemies/GhostBandit';
import {locationComplete} from "../../sharedFunctions.ts";

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
        actions:
            [[
                'Search',
                {
                    text: 'Search the stone mount',
                    execute: (game: IGame) => {
                        game.activeCharacter.currency += 35;
                        game.logToLocationLog(game.currentLocation.descriptions['search']);
                    },
                    activeNight: true
                }
            ]],
        leaveEvents:
            [[
                'Leave',
                (game: IGame) => {
                    locationComplete(game, game.currentLocation, () => game.currentLocation.enemies.length == 0, () => Object.keys(game.currentLocation.actions).length == 0);
                    return true;
                }
            ]]
    });
}