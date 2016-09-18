module QuestForTheKing.Persons {
    export function QueenBee(): IPerson {
        return {
            name: 'Queen Bee',
            //pictureFileName: 'bandit.jpg',
            hitpoints: 10,
            attack: '1d6',
            reward: 5,
            items: [
                Items.Beesting
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
                handleReply: (game, person, node, reply) => {
                    if (reply.linkToNode === 'giveflower') {
                        game.character.items.push(game.getItem(Items.Beesting));
                        game.character.items.remove(Items.Magicflower);
                    }
                }
            },
            disposition: StoryScript.Disposition.Friendly
        }
    }
}