// src/Games/MyInteractiveMap/persons/Moser.ts
import { IPerson, Person } from '../types';
import conversation from './Moser.html?raw';

export function Moser() {
    return Person({
        description: conversation,
        name: 'Johann Jacob Moser',
        hitpoints: 0, // No combat
        attack: '0', // No combat
        canAttack: false, // Disable combat
        items: [], // No items
        currency: 0, // No currency
        conversation: {
            actions: [] // No special actions needed
        },
        quests: [] // No quests
    });
}
