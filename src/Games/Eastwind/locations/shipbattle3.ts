import {Location} from '../types';
import description from './shipbattle3.html?raw';

export function Shipbattle3() {
    return Location({
        name: 'Shipbattle3',
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