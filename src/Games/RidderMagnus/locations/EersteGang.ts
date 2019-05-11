namespace RidderMagnus.Locations {
    export function EersteGang() {
        return Location({
            name: 'Een lange, rechte gang',

            destinations: [
                {
                    name: 'Naar de tunnel',
                    target: Locations.Tunnel
                }
            ],
            actions: [
                {
                    text: 'Zoeken',
                    execute: (game: IGame) => {
                        var check = Math.floor(Math.random() * 6 + 1);
                        var result;
                        result = check + game.character.zoeken;

                        if (result > 6) {
                            game.logToLocationLog('Er zitten twee ruitvormige gaten in de muur, recht tegenover de tunnel. En tussen de twee gaten in loopt een smalle spleet van boven naar onderen over de muur.');
                           
                        }
                        else {
                            game.logToActionLog('Je vindt niets bijzonders.');
                           
                        }
                    }
                }
            ]
        });
    }
}