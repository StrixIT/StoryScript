module RidderMagnus.Locations {
    export function Kelder(): StoryScript.ILocation {
        return {
            name: 'De Kelder',
            //Bij eerste bezoek: er komt hier als event eenmalig een dire rat, tenzij je succesvol sluipt. 
            //Met zoeken is er een ring te vinden. 
            //Als de ring al gevonden is, levert zoeken vooral ratten op.
            enemies: [
                Enemies.DireRat
            ],
            destinations: [
                {
                    text: 'Naar boven',
                    target: Locations.Start
                }
            ],
            actions: [
                {
                    text: 'Zoek de ring',
                    type: 'zoeken',
                    execute: (game: IGame) => {
                        var check = Math.floor(Math.random() * 6 + 1);
                        var result;
                        result = check * game.character.zoeken;

                        if (result > 4) {
                            game.currentLocation.items.push(Items.GoudenRing());
                            game.logToLocationLog('Onder een stoffig wijnvat zie je iets glinsteren. Ja! Het is hem! Snel terug naar de koningin.');
                        }
                        else {
                            game.logToActionLog('Waar is dat ding toch??');
                        }
                    }
                }
            ]
        }
    }
}