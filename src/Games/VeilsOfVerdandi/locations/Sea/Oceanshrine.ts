import {Character, IGame, Location} from '../../types';
import description from './Oceanshrine.html?raw';
import {CentralForest} from '../CentralForest/CentralForest';
import {Octopus} from './Octopus';
import {ClassType} from "../../classType.ts";
import {ActionStatus} from "storyScript/Interfaces/enumerations/actionStatus.ts";
import {ActionType} from "storyScript/Interfaces/storyScript.ts";

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
        actions:
            [[
                'TouchAltar',
                {
                    text: 'Touch the Altar',
                    execute: (game: IGame) => {
                        const key = game.worldProperties.isDay ? 'touchday' : 'touchnight';
                        game.logToLocationLog(game.currentLocation.descriptions[key]);

                        // Fully heal the party.
                        game.party.characters.forEach(c => {
                            c.currentHitpoints = c.hitpoints;
                        });

                        game.currentLocation.items.map(i => i.inactive = false);
                    }
                },
            ]]
    });
}