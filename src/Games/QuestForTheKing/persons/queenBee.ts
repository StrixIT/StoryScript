import { Person } from 'storyScript/Interfaces/storyScript';
import { Beesting } from '../items/Beesting';
import { Magicflower } from '../items/Magicflower';
import description from './QueenBee.html';

export function QueenBee() {
    return Person({
        name: 'Queen Bee',
        description: description,
        hitpoints: 10,
        attack: '1d6',
        reward: 5,
        items: [
            Beesting()
        ],
        currency: 10,
        conversation: {
            showUnavailableReplies: false,
            selectActiveNode: (game, person) => {
                if (game.character.items.get(Magicflower)) {
                    return person.conversation.nodes.filter(n => { return n.node == 'alreadyhaveflower' })[0];
                }

                return person.conversation.nodes[0];
            },
            actions: {
                'giveflower': (game, person) => {
                    game.character.items.add(Beesting);
                    game.character.items.delete(Magicflower);
                }
            }
        }
    });
}