import {Rat} from '../enemies/Rat';
import {Location} from '../types';
import description from './ShipsHoldAft.html?raw';

export function ShipsHoldAft() {
    return Location({
        name: 'ShipsHoldAft',
        description: description,
        destinations: [],
        features: [],
        items: [],
        enemies: [
            Rat()
        ],
        persons: [],
        trade: [],
        enterEvents: [],
        leaveEvents: [],
        actions: [],
        combatActions: [],
    });
}