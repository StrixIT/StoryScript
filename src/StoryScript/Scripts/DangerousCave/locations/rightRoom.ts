module StoryScript.Locations {
    export function RightRoom(): ILocation {
        return {
            name: 'Een schemerige gang',
            enemies: [
                Enemies.GiantBat
            ],
            destinations: [
                {
                    text: 'Richting het licht',
                    target: Locations.CandleLitCave
                },
                {
                    text: 'Richting ingang',
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
        }
    }
}