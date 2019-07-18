namespace RidderMagnus.Locations {
    export function Start() {
        return Location({
            name: 'De Troonzaal',
            items: [
                Items.LichtSpreuk()
            ],
            persons: [
                //persons.Trader
                //persons.Trainer
                Persons.KoninginDagmar()
            ],
            destinations: [
                //{
                //    text: 'Naar de kamer van de prinses!',
                //    target: Locations.SlaapkamerPrinses
                //}
            ],

            //elke destination is voor een quest en moeten dus 1 voor 1 zichtbaar worden

            descriptionSelector: (game: IGame) => {
                if (game.character.quests.get(Quests.GoudenRing)) {
                    return "een";
                }

                return "nul";

                //wanneer mogelijk moet deze checken of de quest 'vind de ring' actief is.
                //quest 2: prinses zegt dat er een monster in haar kamer is. Doe er wat aan.
                //activeer dan pas nieuwe destination: Slaapkamer prinses
                //Quest 3: waar komen de ratten vandaan? Doorzoek zowel slaapkamer (luik onder bed) als kelder (hol wijnvat met tunnel)
                // dat kan subtiel met zoeken / magie, of lomp met veel geweld en lawaai
                //Quest 4: into the tunnels! Er zit hier een val en een deur die op slot is. Daar achter een doolhof.
                //Quest 5: verken het doolhof - (en ontsnap met veel moeite)
                //quest 6: de prinses is ontvoerd! je moet terug de doolhof in. Wat heb je nodig? (draad, licht, ? )
            },
            actions: [
                {
                    text: 'Genees me',
                    execute: (game: IGame) => {
                        Actions.Heal('20d1')(game, {});
                        game.logToActionLog('De koningin legt haar hand op je hoofd. Je voelt je direct beter.');
                        return true
                    }
                }
            ]
        });
    }
}