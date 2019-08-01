namespace RidderMagnus.Locations {
    export function SlaapkamerPrinses() {
        return Location({
            name: 'De Slaapkamer van de Prinses',

            destinations: [
                {
                    name: 'Naar beneden',
                    target: Locations.Start
                }
            ],
            actions: [
                {
                    //Toelichting: dit is een zoekactie, goed resultaat vind de ratman, zodat je hem kan aanvallen met voordeel
                    text: 'Doorzoek de kamer',
                    execute: (game: IGame) => {
                        var check = Math.floor(Math.random() * 6 + 1);
                        var result;
                        result = check + game.character.sluipen;

                        if (result > 6) {
                            game.logToLocationLog('Daar! Onder het bed ligt echt een monster. Het heeft jou nog niet gezien.');
                            game.currentLocation.actions.push({
                                text: 'Besluip het monster',
                                actionType: StoryScript.ActionType.Combat,
                                execute: (game: IGame) => {
                                    var ratman = Enemies.RatMan();
                                    game.currentLocation.enemies.push(ratman);
                                    var damage = game.character.sluipen * game.character.vechten;
                                    ratman.hitpoints -= damage;
                                    game.logToLocationLog('Je valt onverhoeds aan en doet ' + damage + ' schade.');
                                }
                            });
                        }
                        else {
                            game.logToActionLog('Opeens word je aangevallen door een monster! Het lijkt op een gigantische rat die op zijn achterpoten loopt.');
                            game.currentLocation.enemies.push(Enemies.RatMan);
                        }
                    }
                }
            ]
        });
    }
}