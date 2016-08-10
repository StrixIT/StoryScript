module QuestForTheKing.Locations {
    export function WeaponSmith(): StoryScript.ILocation {
        return {
            name: 'Weapon Smith',
            destinations: [
                {
                    text: 'Day 2',
                    target: Locations.Day2
                },              
                {

                    text: 'Healers Tent',
                    target: Locations.HealersTent
                },
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