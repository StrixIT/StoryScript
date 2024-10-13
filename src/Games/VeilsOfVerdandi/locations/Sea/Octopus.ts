import {IGame, Location} from '../../types';
import description from './Octopus.html?raw';
import {Octopus as OctopusEnemy} from '../../enemies/Octopus';
import {ActionStatus, ActionType} from 'storyScript/Interfaces/storyScript';
import {OceanShrine} from './OceanShrine';
import {Fisherman} from "../Beach/Fisherman.ts";
import {locationComplete} from "../../sharedFunctions.ts";

export function Octopus() {
    return Location({
        name: 'The Giant Octopus',
        description: description,
        destinations: [
            {
                name: 'The Ocean Shrine',
                target: OceanShrine,
                style: 'location-water'
            },
            {
                name: 'The Fisherman\'s cottage',
                target: Fisherman,
                style: 'location-water'
            }
        ],
        enemies: [
            OctopusEnemy()
        ],
        actions:
            [[
                'AttackShadow',
                {
                    text: 'Attack the Shadow',
                    status:
                    ActionStatus.Available,
                    actionType:
                    ActionType.Check,
                    execute:
                        (game: IGame) => {
                            game.currentLocation.descriptionSelector = 'attack';
                            game.currentLocation.enemies.map(e => e.inactive = false);
                        }
                }
            ],
                [
                    'LeaveShadow',
                    {
                        text: 'Leave the Shadow alone',
                        status:
                        ActionStatus.Available,
                        actionType:
                        ActionType.Check,
                        execute:
                            (game: IGame) => {
                                // Remove the octopus and the attack action when chosing to sail past.
                                game.currentLocation.enemies.clear();
                                game.currentLocation.actions.clear();
                                game.currentLocation.descriptionSelector = 'floatby';
                            }
                    }]
            ],
        leaveEvents:
            [[
                'Leave',
                (game: IGame) => {
                    locationComplete(game, game.currentLocation, () => game.currentLocation.enemies.length == 0, () => game.currentLocation.enemies.length == 0);
                    return true;
                }
            ]]
    });
}