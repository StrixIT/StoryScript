import {IGame, Location} from '../../types';
import description from './Dryad.html?raw';
import {ForestPond} from './ForestPond';
import {backToForestText} from "../../explorationRules.ts";
import {EastRoad} from "./EastRoad.ts";

export function Dryad() {
    return Location({
        name: 'The Dryad Tree',
        description: description,
        destinations: [
            {
                name: 'The Forest Pond',
                target: ForestPond,
                style: 'location-danger'
            },
            {
                name: backToForestText,
                target: EastRoad
            }
        ],
        leaveEvents:
            [[
                'LeaveDryad',
                (game: IGame) => {
                    if (game.currentLocation.descriptionSelector === 'return') {
                        game.currentLocation.descriptionSelector = null;
                        game.currentLocation.completedDay = true;
                        game.currentLocation.completedNight = true;
                        return false;
                    }

                    return true;
                }
            ]]
    });
}