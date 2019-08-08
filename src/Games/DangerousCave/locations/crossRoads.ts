namespace DangerousCave.Locations {
    export function CrossRoads() {
        return Location({
            name: 'Een kruispunt',
            enterEvents: [
                (game: IGame) => {
                    var orkCorridor = game.locations.get(Locations.DarkCorridor);
                    var orkPresent = !orkCorridor.hasVisited;

                    if (game.character.oplettendheid > 2 && orkPresent) {
                        game.logToLocationLog('Je hoort vanuit de westelijke gang een snuivende ademhaling.');
                    }
                }
            ],
            destinations: [
                {
                    name: 'Donkere tunnel (oost)',
                    target: Locations.DarkCorridor
                },
                {
                    name: 'Nog niet! Gang (noord)',
                    target: Locations.Temp
                },
                {
                    name: 'Donkere tunnel (west)',
                    target: Locations.WestCrossing
                },
                {
                    name: 'Gang (zuid)',
                    target: Locations.RightCorridor
                }
            ],
        });
    }
}