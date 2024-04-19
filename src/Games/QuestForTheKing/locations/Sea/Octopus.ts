import { Location, IGame } from '../../types';
import description from './Octopus.html';
import { Octopus as OctopusEnemy } from '../../enemies/Octopus';
import { ActionStatus, ActionType } from 'storyScript/Interfaces/storyScript';
import { Oceanshrine } from './Oceanshrine';
import { Honeycastle } from './Honeycastle';
import { Fisherman } from '../NorthForest/Fisherman';

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
                name: 'Honeycomb Castle',
                target: Honeycastle
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
                    game.currentLocation.enemies.clear();
                    game.currentLocation.actions.clear();
                    game.logToLocationLog(game.currentLocation.descriptions['floatby']);
                }
            }
        ]           
    });
}