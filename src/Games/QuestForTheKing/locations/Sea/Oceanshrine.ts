﻿import {Location, IGame} from '../../types';
import description from './Oceanshrine.html';
import {ActionType} from 'storyScript/Interfaces/storyScript';
import {Magicring} from '../../items/Magicring';
import {CentralForest} from '../CentralForest/CentralForest';
import {Octopus} from './Octopus';

export function Oceanshrine() {
    return Location({
        name: 'The Ocean Shrine',
        description: description,
        destinations: [
            {
                name: 'The Octopus',
                target: Octopus
            },
            {
                name: 'The Eastern Road',
                target: CentralForest,
            },
        ],
        items: [
            // Todo: should this be inactive and only show for the wizard when touching the altar?
            Magicring(),
        ],
        actions:
            [[
                'TouchAltar',
                {
                    text: 'Touch the Altar',
                    execute: (game: IGame) => {
                        var key = game.worldProperties.isDay ? 'touchday' : 'touchnight';
                        game.logToLocationLog(game.currentLocation.descriptions[key]);

                        // Fully heal the party.
                        game.party.characters.forEach(c => {
                            c.currentHitpoints = c.hitpoints;
                        });

                        // Todo: should only the wizard be able to search the altar?
                        const isWizard = false; //game.activeCharacter.class === Class.Wizard

                        if (isWizard) {
                            game.currentLocation.actions.add(['SearchAltar', {
                                text: 'Search the altar',
                                actionType: ActionType.Check,
                                execute: (game: IGame) => {
                                    game.currentLocation.items.map(i => i.inactive = false);
                                }
                            }]);
                        }
                    }
                }
            ]]
    });
}