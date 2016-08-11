module RidderMagnus.Locations {
    export function Start(): ILocation {
        return {
            name: 'De Troonzaal',
            destinations: [
                {
                    text: 'Naar de kelder!',
                    target: Locations.Kelder
                },
                {
                    text: 'Naar de kamer van de prinses!',
                    target: Locations.SlaapkamerPrinses
                }
            ],

            //elke destination is voor een quest en moeten dus 1 voor 1 zichtbaar worden

            descriptionSelector: (game: IGame) => {
                if (game.character.items.get(Items.GoudenRing)) {
                    return "een";
                }

                return "nul";

                //wanneer mogelijk moet deze checken of de quest 'vind de ring' actief is.
                //quest 2: prinses zegt dat er een monster in haar kamer is. Doe er wat aan.
                //activeer dan pas nieuwe destination: Slaapkamer prinses
            },
            actions: [
                {
                    text: 'Genees me',
                    execute: (game: IGame) => {
                        Actions.Heal('20d1')(game, {});
                        game.logToActionLog('De koningin legt haar hand op je hoofd. Je voelt je direct beter.');
                        return true
                    }
                },
                {
                    text: 'Geef de ring terug',
                    status: (game: IGame) => {
                        return game.character.items.get(Items.GoudenRing) != undefined ? StoryScript.ActionStatus.Available : StoryScript.ActionStatus.Unavailable;
                    },
                    execute: (game: IGame) => {
                        var ring = game.character.items.get(Items.GoudenRing);
                        game.character.items.remove(ring);
                        game.logToLocationLog('Dankbaar neemt de koningin de ring aan. "Hier is uw beloning," spreekt ze met een glimlach.');


                        var randomItem = game.randomItem((item: IItem) => {
                            return (<any>item).id !== (<any>Items.GoudenRing).name && item.price < 30;
                            //of item met price <30, is nog beter
                        });
                        game.character.items.push(randomItem);

                       //de beloning moet een keuze worden: geld, random training of random item (item hier geen gouden ring)
                        //of een specifiek item gebaseerd op het personage? of keuze uit specifieke items
                    }

                    //wanneer mogelijk moet deze checken of de quest 'vind de ring' actief is.
                }

            ]
        }
    }
}