module RidderMagnus.Persons {
    export function KoninginDagmar(): IPerson {
        return {
            name: 'Koningin Dagmar',
            //pictureFileName:
            hitpoints: 1000,
            attack: '10d6',
            reward: 100,
            currency: 1000,
            conversation: {
                selectActiveNode: (game, person) => {
                    var quest = game.character.quests.get(Quests.GoudenRing);
                    var nodes = person.conversation.nodes;

                    if (quest && !quest.completed) {
                        return nodes.filter(n => n.node === "eerstequestklaar")[0];
                    }

                    quest = game.character.quests.get(Quests.RattenStaarten);

                    if (quest && !quest.completed) {
                        return nodes.filter(n => n.node === "tweedequestklaar")[0];
                    }

                    return nodes[0];
                }
            },
            quests: [
                Quests.GoudenRing,
                Quests.RattenStaarten
            ]
        }
    }
}