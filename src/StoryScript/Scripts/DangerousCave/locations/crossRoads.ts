module DangerousCave.Locations {
    export function CrossRoads(): StoryScript.ILocation {
        return {
            name: 'Een kruispunt',
            events: [
                (game: IGame) => {
                    var orkCorridor = game.locations.first(Locations.DarkCorridor);
                    var orkPresent = !orkCorridor.hasVisited;

                    if (game.character.oplettendheid > 2 && orkPresent) {
                        game.logToLocationLog('Je hoort vanuit de westelijke gang een snuivende ademhaling.');
                    }
                }
            ],
            destinations: [
                {
                    text: 'Donkere tunnel (oost)',
                    target: Locations.DarkCorridor
                },
                {
                    text: 'Nog niet! Gang (noord)',
                    target: Locations.Temp
                },
                {
                    text: 'Donkere tunnel (west)',
                    target: Locations.WestCrossing
                },
                {
                    text: 'Gang (zuid)',
                    target: Locations.RightCorridor
                }
            ],
        }
    }
}