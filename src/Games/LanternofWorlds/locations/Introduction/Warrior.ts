import { Location } from '../../types'
import description from './Warrior.html'
import { Tiger } from '../../enemies/Tiger';
import { forestMap } from '../../maps/forest';

export function Warrior() {
    return Location({
        name: 'Warrior',
        description: description,
        destinations: [
            
        ],
        features: forestMap(),
        items: [
        ],
        enemies: [
            Tiger()
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