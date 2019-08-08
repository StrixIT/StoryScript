namespace DangerousCave.Locations {
    export function RightRoom() {
        return Location({
            name: 'Een schemerige gang',
            enemies: [
                Enemies.GiantBat()
            ],
            destinations: [
                {
                    name: 'Richting het licht',
                    target: Locations.CandleLitCave
                },
                {
                    name: 'Richting ingang',
                    target: Locations.Entry
                }
            ],
            actions: [
                Actions.Search({
                    difficulty: 8,
                    success: function (game) {
                        game.logToLocationLog('Je ruikt de geur van brandende kaarsen.')
                    },
                    fail: function (game) {
                        game.logToLocationLog('Er zijn hier heel veel vleermuizen. En heel veel vleermuispoep.');
                    }
                })
            ]
        });
    }
}