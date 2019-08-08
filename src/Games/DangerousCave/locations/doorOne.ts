namespace DangerousCave.Locations {
    export function DoorOne() {
        return Location({
            name: 'Een donkere gang met een deur',
            destinations: [
                {
                    name: 'De kamer in',
                    target: Locations.RoomOne
                },
                {
                    name: 'Donkere gang',
                    target: Locations.LeftCorridor
                }
            ],
            actions: [
                {
                    text: 'Schop tegen de deur',
                    execute: (game: IGame) => {
                        var check = Math.floor(Math.random() * 6 + 1);
                        var result;
                        result = check * game.character.kracht;

                        if (result > 8) {
                            game.changeLocation(Locations.RoomOne);
                            game.logToLocationLog('Met een enorme klap schop je de deur doormidden. Je hoort een verrast gegrom en ziet een ork opspringen.');
                            return false;
                        }
                        else {
                            game.logToActionLog('Auw je tenen!! De deur is nog heel.');
                            return true;
                        };
                    }
                },
                Actions.Unlock({
                    difficulty: 10,
                    success: function (game: IGame) {
                        game.changeLocation(Locations.RoomOne);
                        game.logToLocationLog('Met meegebrachte pinnetjes duw je in het slot op het mechanisme tot je een klik voelt. De deur is open!');
                        game.logToLocationLog('Je duwt de deur open en kijkt naar binnen.');
                    },
                    fail: function (game) {
                    }
                }),
                Actions.Search({
                    difficulty: 10,
                    success: (game: IGame) => {
                        game.logToLocationLog('Je tast de deur, vloer en muren af. Hoog aan de rechtermuur vind je aan een haakje een grote sleutel!')
                    },
                    fail: (game: IGame) => {
                        game.logToLocationLog('Je tast de deur, vloer en muren af. Stenen, hout en gruis. Je vindt niets nuttigs.');
                    }
                })
            ]
        });
    }
}