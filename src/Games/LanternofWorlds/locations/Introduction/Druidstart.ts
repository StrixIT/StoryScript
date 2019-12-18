import { Location } from '../../types'
import description from './Druidstart.html'
import { druidMap } from '../../maps';

export function Druidstart() {
    return Location({
        name: 'Forest',
        description: description,
        destinations: [
            
        ],
        features: druidMap(),
        items: [
        ],
        enemies: [
        ],
        persons: [
        ],
        enterEvents: [
        ],
        leaveEvents: [
        ],
        actions: [
        ],
        combatActions: [
        ],
    });
}