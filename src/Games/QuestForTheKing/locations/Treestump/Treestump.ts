module QuestForTheKing.Locations {
    export function Treestump() {
        return Location({
            name: 'The Satyr',
            destinations: [
                {
                    name: 'Back to the Map',
                    target: Locations.Quest1map3,
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
                            game.currentLocation.actions.push({
                                text: 'Intercept the strange man',
                                execute: (game: IGame) => {
                                    // Todo: what check to do?
                                    if (check) {
                                        game.logToLocationLog(game.currentLocation.descriptions['intercept']);
                                        game.currentLocation.enemies.push(Enemies.Satyr);
                                    }
                                    else {
                                        game.logToLocationLog(game.currentLocation.descriptions['failintercept']);
                                    }

                                    game.currentLocation.destinations.map(d => d.inactive = false);
                                }
                            });
                        }
                        else {
                            // If the player fails to resist the music, the Satyr takes half of his gold. Enable the exit.
                            game.logToLocationLog(game.currentLocation.descriptions['failresistmusic']);
                            game.character.currency = Math.floor(game.character.currency / 2);
                            game.currentLocation.destinations.map(d => d.inactive = false);
                        }
                    }
                }
            ]
        });
    }
}    
