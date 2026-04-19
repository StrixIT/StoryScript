// src/Games/MyInteractiveMap/persons/Moser.ts
import { IPerson, Person } from '../types';
import conversation from './Moser.html?raw';

export function Moser() {
    return Person({
        description: conversation,
        name: 'Johann Jacob Moser',
        conversation: {
            actions: [] // No special actions needed
        },
        quests: [] // No quests
    });
}
