module StoryScript.Locations {
    export function DoorOne(): ILocation {
        return {
            name: 'Een donkere gang met een deur',
            destinations: [
                {
                    text: 'De kamer in',
                    target: Locations.RoomOne
                },
                {
                    text: 'Donkere gang',
                    target: Locations.LeftCorridor
                }
            ],
            actions: [
                {
                    text: 'Schop tegen de deur',
                    type: 'fight',
                    execute: (game: DangerousCave.Game) => {
                        var check = Math.floor(Math.random() * 6 + 1);
                        var result;
                        result = check * game.character.kracht;

                        if (result > 8) {
                            game.changeLocation(Locations.RoomOne);
                            game.logToLocationLog('Met een enorme klap schop je de deur doormidden. Je hoort een verrast gegrom en ziet een ork opspringen.');
                        }
                        else {
                            game.logToActionLog('Auw je tenen!! De deur is nog heel.');
                        };
                    }
                },
                Actions.Unlock({
                    difficulty: 10,
                    success: function (game: DangerousCave.Game) {
                        game.changeLocation(Locations.RoomOne);
                        game.logToLocationLog('Met meegebrachte pinnetjes duw je in het slot op het mechanisme tot je een klik voelt. De deur is open!');
                        game.logToLocationLog('Je duwt de deur open en kijkt naar binnen.');
                    },
                    fail: function (game) {
                    }
                }),
                Actions.Search({
                    difficulty: 10,
                    success: (game) => {
                        game.logToLocationLog('Je tast de deur, vloer en muren af. Hoog aan de rechtermuur vind je aan een haakje een grote sleutel!')
                    },
                    fail: (game) => {
                        game.logToLocationLog('Je tast de deur, vloer en muren af. Stenen, hout en gruis. Je vindt niets nuttigs.');
                    }
                })
            ]
        }
    }
}