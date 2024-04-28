import { Location, IGame } from '../../types';
import description from './Treestump.html';
import { Satyr } from '../../enemies/Satyr';

export function Treestump() {
    return Location({
        name: 'The Satyr',
        description: description,
        destinations: [
            {
                name: 'Back to the Map',
                target: null,
                inactive: true
            },                                        
        ],
        actions: [
            {
                text: 'Listen to the music',
                execute: (game: IGame) => {
                    // Todo: what check to do?
                    var check = true;

                    if (check) {
                        // If the player resists the music, allow him to catch the Satyr
                        game.logToLocationLog(game.currentLocation.descriptions['resistmusic']);
                        game.currentLocation.actions.add({
                            text: 'Intercept the strange man',
                            execute: (game: IGame) => {
                                // Todo: what check to do?
                                if (check) {
                                    game.logToLocationLog(game.currentLocation.descriptions['intercept']);
                                    game.currentLocation.enemies.add(Satyr);
                                }
                                else {
                                    game.logToLocationLog(game.currentLocation.descriptions['failintercept']);
                                }

                                game.currentLocation.destinations.map(d => d.inactive = false);
                            }
                        });
                    }
                    else {
                        // TODO: support multiple characters or use party gold.
                        // If the player fails to resist the music, the Satyr takes half of his gold. Enable the exit.
                        game.logToLocationLog(game.currentLocation.descriptions['failresistmusic']);
                        game.activeCharacter.currency = Math.floor(game.activeCharacter.currency / 2);
                        game.currentLocation.destinations.map(d => d.inactive = false);
                    }
                }
            }
        ]
    });
}