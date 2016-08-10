module QuestForTheKing.Locations {
    export function NightInYourTent(): StoryScript.ILocation {
        return {
            name: 'Night in your Tent',
            destinations: [
                {
                    text: 'Assassins Defeated',
                    target: Locations.AssassinsDefeated
                }
            ],
            actions: [
                //Actions.Search({
                //    difficulty: 10,
                //    success: function (game) {
                //        game.logToLocationLog('Aan de achterkant van het waarschuwingsbord staan enkele runen in de taal van de orken en trollen. Je kan deze taal helaas niet lezen. Het lijkt erop dat er bloed gebruikt is als inkt.')
                //    },
                //    fail: function (game) {
                //        game.logToLocationLog('Je ziet gras, bomen en struiken. Alle plantengroei stopt een paar centimeter buiten de grot. Binnen is het donker.');
                //    }
                //})
            ]
        }
    }
}