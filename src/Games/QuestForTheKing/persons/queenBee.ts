module QuestForTheKing.Persons {
    export function QueenBee() {
        return Person({
            name: 'Queen Bee',
            //picture: 'bandit.jpg',
            hitpoints: 10,
            attack: '1d6',
            reward: 5,
            items: [
                Items.Beesting()
            ],
            currency: 10,
            conversation: {
                showUnavailableReplies: false,
                selectActiveNode: (game, person) => {
                    if (game.character.items.get(Items.Magicflower)) {
                        return person.conversation.nodes.filter(n => { return n.node == 'alreadyhaveflower' })[0];
                    }

                    return person.conversation.nodes[0];
                },
                actions: {
                    'giveflower': (game, person) => {
                        game.character.items.push(Items.Beesting);
                        game.character.items.remove(Items.Magicflower);
                    }
                }
            }
        });
    }
}