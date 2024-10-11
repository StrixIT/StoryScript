import {IGame, Location} from '../../types';
import description from './Octopus.html?raw';
import {Octopus as OctopusEnemy} from '../../enemies/Octopus';
import {ActionStatus, ActionType} from 'storyScript/Interfaces/storyScript';
import {Oceanshrine} from './Oceanshrine';
import {Fisherman} from "../Beach/Fisherman.ts";

export function Octopus() {
    return Location({
        name: 'The Giant Octopus',
        description: description,
        destinations: [
            {
                name: 'The Ocean Shrine',
                target: Oceanshrine
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
                            game.logToLocationLog(game.currentLocation.descriptions['attacknight']);
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
                                game.logToLocationLog(game.currentLocation.descriptions['floatby']);
                            }
                    }]
            ]
    });
}