namespace DangerousCave.Locations {
    export function Start() {
        return Location({
            name: 'De ingang van de Gevaarlijke Grot',
            destinations: [
                {
                    name: 'Ga de grot in',
                    target: Locations.Entry,
                }
            ],
            actions: [
                Actions.Search({
                    difficulty: 10,
                    success: function (game) {
                        game.logToLocationLog('Aan de achterkant van het waarschuwingsbord staan enkele runen in de taal van de orken en trollen. Je kan deze taal helaas niet lezen. Het lijkt erop dat er bloed gebruikt is als inkt.')
                    },
                    fail: function (game) {
                        game.logToLocationLog('Je ziet gras, bomen en struiken. Alle plantengroei stopt een paar centimeter buiten de grot. Binnen is het donker.');
                    }
                })
            ]
        });
    }
}