import {Location} from '../types';
import description from './Sharpsail_tavern.html?raw';

export function SharpsailTavern() {
    return Location({
        name: 'Sharpsail_tavern',
        description: description,
        destinations: [],
        features: [],
        items: [],
        enemies: [],
        persons: [],
        trade: [],
        enterEvents: [],
        leaveEvents: [],
        actions: [],
        combatActions: [],
    });
}