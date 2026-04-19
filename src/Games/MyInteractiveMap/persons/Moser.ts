// src/Games/MyInteractiveMap/persons/Moser.ts
import { IPerson, Person } from '../types';
import conversation from './Moser.html?raw';

export function Moser(): IPerson {
    return Person({
        name: 'Johann Jacob Moser',
        description: conversation,
        hitpoints: 1, // Minimum value required by IPerson
        canAttack: false, // Disable combat
        items: [], // No items
        currency: 0, // No currency
        conversation: {
            actions: [] // No special actions
        },
        quests: [] // No quests
    });
}