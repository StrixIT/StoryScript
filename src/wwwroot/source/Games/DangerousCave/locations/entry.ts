namespace DangerousCave.Locations {
    export function Entry(): StoryScript.ILocation {
        return {
            name: 'De grot',
            // Example
            //descriptionSelector: function() {
            //    return game.currentLocation.descriptions['lantern'];
            //},
            //navigationDisabled: true,
            items: [
                Items.Lantern
            ],
            enterEvents: [
                (game: IGame) => {
                    if (game.character.oplettendheid > 1) {
                        game.logToLocationLog('Je ruikt bloed.');
                    }
                }
            ],
            destinations: [
                {
                    name: 'Donkere gang (west)',
                    target: Locations.LeftCorridor
                },
                {
                    name: 'Schemerige gang (oost)',
                    target: Locations.RightCorridor
                }
            ],
            actions: [
                Actions.Search({
                    difficulty: 5,
                    success: (game) => {
                        game.logToLocationLog('Op de muur staat een pijl, getekend met bloed. Hij wijst naar de rechtergang.')
                    },
                    fail: (game) => {
                        game.logToLocationLog('Je vindt alleen stenen en stof.');
                    }
                })
            ]
        };
    }
}