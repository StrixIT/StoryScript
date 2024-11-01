import {IGame, Location} from '../../types';
import description from './Stonemount.html?raw';
import {Wolf} from '../../enemies/Wolf';
import {GhostBandit} from '../../enemies/GhostBandit';
import {locationComplete} from "../../sharedFunctions.ts";
import {backToForestText} from "../../explorationRules.ts";
import {SouthRoad} from "./SouthRoad.ts";
import {Pearl} from "../../items/Pearl.ts";
import {Ruby} from "../../items/Ruby.ts";

export function Stonemount() {
    return Location({
        name: 'The Stone Mount',
        description: description,
        picture: true,
        destinations: [
            {
                name: backToForestText,
                target: SouthRoad
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
                        game.party.currency += 10;
                        game.currentLocation.items.add(Ruby);
                        game.currentLocation.descriptionSelector = 'search';
                    },
                    activeNight: true
                }
            ]],
        leaveEvents:
            [[
                'Leave',
                (game: IGame) => {
                    locationComplete(game, game.currentLocation, () => game.currentLocation.enemies.length == 0, () => game.currentLocation.actions.length == 0);
                    return true;
                }
            ]]
    });
}