import {Pouch} from '../items/Pouch';
import {Person} from '../types';
import description from './Dante.html?raw';

export function Dante() {
    return Person({
        name: 'Dante',
        description: description,
        hitpoints: 10,
        items: [],
        quests: [],
        canAttack: false,
        conversation: {
            actions: [
                ['givePouch', (game, person) => game.activeCharacter.items.add(Pouch)]
            ]
        },
    });
}