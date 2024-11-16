import {IGame, Location} from '../../types';
import description from './Dryad.html?raw';
import {ForestPond} from './ForestPond';
import {backToForestText} from "../../explorationRules.ts";
import {EastRoad} from "./EastRoad.ts";
import {SmallDiamond} from "../../items/SmallDiamond.ts";

export function Dryad() {
    return Location({
        name: 'The Dryad Tree',
        description: description,
        picture: true,
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
        enterEvents: [[
            'ClaimReward', 
            (game: IGame) => {
                if (game.worldProperties.helpedDryad) {
                    game.currentLocation.descriptionSelector = 'return';
                    game.party.currency += 20;
                    game.activeCharacter.items.add(SmallDiamond);
                    game.activeCharacter.items.add(SmallDiamond);
                    return false;
                }
                
                return true;
            }
        ]],
        leaveEvents:
            [[
                'LeaveDryad',
                (game: IGame) => {
                    if (game.worldProperties.helpedDryad) {
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