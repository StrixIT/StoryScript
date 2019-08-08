namespace RidderMagnus.Locations {
    export function Kelder() {
        return Location({
            name: 'De Kelder',
            sluipCheck: 4,
            //Bij eerste bezoek: er komt hier als event eenmalig een dire rat, tenzij je succesvol sluipt. 
            //Met zoeken is er een ring te vinden. 
            //Als de ring al gevonden is, levert zoeken vooral ratten op.
            enemies: [
                Enemies.ReusachtigeRat()
            ],
            destinations: [
                {
                    name: 'Naar boven',
                    target: Locations.Start
                }
            ],
            actions: [
                {
                    //Toelichting: dit is een zoekactie, goed resultaat vindt de ring, gemiddeld een goudstuk, slecht een rat.
                    text: 'Zoek de ring',
                    execute: (game: IGame) => {
                        var check = Math.floor(Math.random() * 6 + 1);
                        var result;
                        result = check + game.character.zoeken;

                        if (result > 5) {
                            game.character.items.push(Items.GoudenRing);
                            game.logToActionLog('Onder een stoffig wijnvat zie je iets glinsteren. Ja! Het is de ring!');
                            game.logToActionLog('Breng de ring snel terug naar de koningin.');
                            return false;
                        }
                        else if (result >= 3 && result <= 5) {
                            game.character.currency += 1;
                            game.logToActionLog('Daar glinstert iets! Oh, het is een goudstuk.');
                            return true;
                        }
                        else {
                            game.logToActionLog('Waar is die ring toch? Niet onder dit wijnvat, hier is alleen een... rat!');
                            game.logToActionLog('Een enorme rat bespringt je!');
                            game.currentLocation.enemies.push(Enemies.EnormeRat);
                            return true;

                           //dit moet makkelijker zijn als je licht hebt, dan nauwelijks kans op ratten (via betere zoeken skill of via functie?)
                        }
                    }
                }
            ]
        });
    }
}

// var randomEnemy = game.randomEnemy((enemy: IEnemy) => { return enemy.name.indexOf('rat') > -1; });
//bij latere quest een zoekactie die destination: Tunnel onthult