module RidderMagnus.Quests {
    export function GoudenRing(): StoryScript.IQuest {
        return {
            name: "Zoek de gouden ring",
            status: {
                "Gestart": {
                    description: "Zoek de gouden ring",
                    action: (game) => {
                        var location = game.locations.get(Locations.Start);
                        location.destinations.push(
                            {
                                text: 'Naar de kelder!',
                                target: Locations.Kelder
                            }
                        );
                    }
                },
                "Gevonden": {
                    description: "Je hebt de gouden ring gevonden!"
                },
                "Klaar": {
                    description: "Je hebt de gouden ring teruggegeven aan de koningin.",
                    action: (game) => {
                        var ring = game.character.items.get(Items.GoudenRing);
                        game.character.items.remove(ring);
                        game.logToLocationLog('Dankbaar neemt de koningin de ring aan. "Hier is uw beloning," spreekt ze met een glimlach.');

                        var randomItem = game.randomItem((item: IItem) => {
                            return !game.equals(item, Items.GoudenRing) && item.value < 30;

                        });

                        game.character.items.push(randomItem);

                        //de beloning moet een keuze worden: geld, random training of random item (item hier geen gouden ring)
                        //of een specifiek item gebaseerd op het personage? of keuze uit specifieke items
                    }
                }
            }
        }
    }
}