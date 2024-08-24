import {Location} from '../../types';
import description from './Coralcastle.html?raw';

export function Coralcastle() {
    return Location({
        name: 'Coralcastle',
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