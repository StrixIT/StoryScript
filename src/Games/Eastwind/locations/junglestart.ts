import {Location} from '../types';
import {Junglepond} from './Junglepond';
import description from './junglestart.html?raw';

export function Junglestart() {
    return Location({
        name: 'Junglestart',
        description: description,
        destinations: [
            {
                name: 'Go East',
                target: Junglepond,
            },
        ],
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