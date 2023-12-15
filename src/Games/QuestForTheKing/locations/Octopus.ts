import { Location, IGame } from '../types';
import description from './Octopus.html';
import { Quest1map2 } from './ForestOfMyrr/Quest1map2';
import { Octopus as OctopusEnemy } from '../enemies/Octopus';
import { ActionStatus, ActionType } from 'storyScript/Interfaces/storyScript';

export function Octopus() {
    return Location({
        name: 'The Giant Octopus',
        description: description,
        destinations: [
            {
                name: 'Back to the Map',
                target: Quest1map2
            }              
        ],
        enemies: [
            OctopusEnemy()                 
        ],
        actions: [
            {
                text: 'Attack the Shadow',
                status: ActionStatus.Available,
                actionType: ActionType.Check,
                execute: (game: IGame) => {
                    game.logToLocationLog(game.currentLocation.descriptions['attacknight']);
                    game.currentLocation.enemies.map(e => e.inactive = false);
                }
            },
            {
                text: 'Leave the Shadow alone',
                status: ActionStatus.Available,
                actionType: ActionType.Check,
                execute: (game: IGame) => {
                    // Remove the octopus and the attack action when chosing to sail past.
                    game.currentLocation.enemies.length = 0;
                    game.currentLocation.actions.length = 0;
                    game.logToLocationLog(game.currentLocation.descriptions['floatby']);
                }
            }
        ]           
    });
}