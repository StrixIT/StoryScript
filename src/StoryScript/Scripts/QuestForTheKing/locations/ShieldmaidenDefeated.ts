module QuestForTheKing.Locations {
    export function ShieldmaidenDefeated(): StoryScript.ILocation {
        return {
            name: 'Shieldmaiden Defeated',
            destinations: [
                {
                    text: 'Day 4',
                    target: Locations.Day4
                },
                {

                    text: 'Weapon Smith',
                    target: Locations.WeaponSmith3
                },
                {

                    text: 'Healers Tent',
                    target: Locations.HealersTent3
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