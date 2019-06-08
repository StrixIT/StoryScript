namespace DangerousCave.Locations {
    export function LeftCorridor() {
        return Location({
            name: 'Een pikdonkere gang',
            destinations: [
                {
                    name: 'Dieper de grot in',
                    target: Locations.DoorOne,
                    inactive: true
                },
                {
                    name: 'Richting ingang',
                    target: Locations.Entry,
                    inactive: true
                }
            ],
            enterEvents: [
                (game: IGame) => {
                    var damage = Math.floor(Math.random() * 6 + 1) - game.character.vlugheid;
                    game.character.currentHitpoints -= Math.max(0, damage);
                    game.logToActionLog('Aah! Je valt plotseling in een diepe kuil en bezeert je. Je krijgt ' + damage + ' schade door het vallen!');
                    game.logToLocationLog('Er is hier een diepe valkuil.')
                }
            ],
            actions: [
                {
                    text: 'Klim uit de kuil',
                    execute: (game: IGame) => {
                        // Todo: skill check
                        //if (false) {
                        //    game.logToActionLog('Het lukt je niet uit de kuil te klimmen.');
                        //    return true;
                        //}

                        game.logToActionLog('Je klimt uit de kuil.');
                        game.currentLocation.destinations.forEach(d => d.inactive = false);
                    }
                },
                Actions.Search({
                    text: 'Doorzoek de kuil',
                    difficulty: 9,
                    success: (game: IGame) => {
                        game.currentLocation.items.push(Items.LeatherHelmet());
                        game.logToLocationLog('In de kuil voel je botten, spinrag en de resten van kleding. Ook vind je er een nog bruikbare helm!')
                    },
                    fail: (game: IGame) => {
                        game.logToLocationLog('In de kuil voel je botten, spinrag en de resten van kleding.');
                    }
                })
            ]
        });
    }
}