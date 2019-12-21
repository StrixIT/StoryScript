import { Location } from '../../types'
import description from './Druidstart.html'
import { forestMap } from '../../maps/forest';

export function Druidstart() {
    return Location({
        name: 'Forest',
        description: description,
        destinations: [
            
        ],
        features: forestMap(),
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