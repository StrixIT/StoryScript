import { Location, IGame } from '../../types';
import description from './Troll.html?raw';
import { Troll as TrollEnemy } from '../../enemies/Troll';
import {CentralForest} from "./CentralForest.ts";
import {backToForestText} from "../../explorationRules.ts";
import {locationComplete} from "../../sharedFunctions.ts";

export function Troll() {
    return Location({
        name: 'The Troll',
        description: description,
        destinations: [
            {
                name: backToForestText,
                target: CentralForest
            }
        ],
        enemies: [
            TrollEnemy()          
        ],
        actions:
        [[
            'OpenCage',
                {
                    text: 'Open the cage',
                    execute: (game: IGame) => {
                        game.currentLocation.descriptionSelector = 'opencage';
                        game.worldProperties.freedFaeries = true;
                    }
                }
        ]],
        leaveEvents:
            [[
                'Leave',
                (game: IGame) => {
                    locationComplete(game, game.currentLocation, () => game.currentLocation.actions.length == 0, () => game.currentLocation.actions.length == 0);
                    return true;
                }
            ]],
    });
}