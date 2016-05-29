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
                        // Todo: allow pushing definition instead of item.
                        game.character.items.push(Items.SmallShield());
                    },
                    fail: function (game) {
                        game.logToLocationLog('Je vindt niets.');
                    }
                })
            ]
        }
    }
}