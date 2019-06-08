namespace DangerousCave.Locations {
    export function CentreRoom() {
        return Location({
            name: 'Een opslagkamer',
            destinations: [
                {
                    name: 'De kamer van de ork',
                    target: Locations.RoomOne
                }
            ],
            actions: [
                Actions.Search({
                    difficulty: 9,
                    success: function (game: IGame) {
                        game.logToLocationLog('Je vindt een schild!');
                        game.character.items.push(Items.SmallShield());
                    },
                    fail: function (game: IGame) {
                        game.logToLocationLog('Je vindt niets.');
                    }
                })
            ]
        });
    }
}