import { Beesting } from '../items/Beesting';
import { Magicflower } from '../items/Magicflower';
import { Person } from '../types';
import description from './QueenBee.html?raw';

export function QueenBee() {
    return Person({
        name: 'Queen Bee',
        description: description,
        hitpoints: 10,
        damage: '1d6',
        currency: 5,
        items: [
            Beesting()
        ],
        conversation: {
            showUnavailableReplies: false,
            selectActiveNode: (game, person) => {
                let hasFlower = false;

                game.party.characters.forEach(c => hasFlower ?? c.items.get(Magicflower));

                if (hasFlower) {
                    return person.conversation.nodes.filter(n => { return n.node == 'alreadyhaveflower' })[0];
                }

                return person.conversation.nodes[0];
            },
            actions: [[
                'GiveFlower', (game, person) => {
                    game.activeCharacter.items.add(Beesting);
                    game.helpers.removeItemFromParty(Magicflower);
                }
            ]]
        }
    });
}