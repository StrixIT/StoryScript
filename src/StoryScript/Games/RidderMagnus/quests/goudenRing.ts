module RidderMagnus.Quests {
    export function GoudenRing(): StoryScript.IQuest {
        return {
            name: "Zoek de gouden ring",
            status: (game, quest, done) => {
                return 'Je hebt de ring ' + (done ? '' : 'nog niet ') + 'gevonden' + (done ? '!' : '.');
            },
            start: (game, quest) => {
                var location = game.locations.get(Locations.Start);

                location.destinations.push(
                    {
                        text: 'Naar de kelder!',
                        target: Locations.Kelder
                    }
                );
            },
            checkDone: (game, quest) => {
                return game.character.items.get(Items.GoudenRing) != null;
            },
            complete: (game, quest) => {
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