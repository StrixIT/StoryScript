import {IGame, Location} from '../../types';
import description from './Oceanshrine.html?raw';
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
                    }
                }
            ]]
    });
}