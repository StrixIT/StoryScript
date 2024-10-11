import { BeeSting } from '../items/BeeSting.ts';
import { MagicFlower } from '../items/MagicFlower.ts';
import { Person } from '../types';
import description from './QueenBee.html?raw';

export function QueenBee() {
    return Person({
        name: 'Queen Bee',
        description: description,
        hitpoints: 10,
        canAttack: false,
        items: [
            BeeSting()
        ],
        conversation: {
            showUnavailableReplies: false,
            selectActiveNode: (game, person) => {
                let hasFlower = false;

                game.party.characters.forEach(c => hasFlower ?? c.items.get(MagicFlower));

                if (hasFlower) {
                    return person.conversation.nodes.filter(n => { return n.node == 'alreadyhaveflower' })[0];
                }

                return person.conversation.nodes[0];
            },
            actions: [[
                'GiveFlower', (game, person) => {
                    game.activeCharacter.items.add(BeeSting);
                    game.helpers.removeItemFromParty(MagicFlower);
                }
            ]]
        }
    });
}