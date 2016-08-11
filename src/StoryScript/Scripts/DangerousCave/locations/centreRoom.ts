module DangerousCave.Locations {
    export function CentreRoom(): StoryScript.ILocation {
        return {
            name: 'Een opslagkamer',
            destinations: [
                {
                    text: 'De kamer van de ork',
                    target: Locations.RoomOne
                }
            ],
            actions: [
                Actions.Search({
                    difficulty: 9,
                    success: function (game) {
                        game.logToLocationLog('Je vindt een schild!');
                        var item = game.getItem(Items.SmallShield);
                        game.character.items.push(item);
                    },
                    fail: function (game) {
                        game.logToLocationLog('Je vindt niets.');
                    }
                })
            ]
        }
    }
}