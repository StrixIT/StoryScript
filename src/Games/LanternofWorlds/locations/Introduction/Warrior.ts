import { Location } from '../../types'
import description from './Warrior.html'
import { Tiger } from '../../enemies/Tiger';
import { druidMap } from '../../maps';

export function Warrior() {
    return Location({
        name: 'Warrior',
        description: description,
        destinations: [
            
        ],
        features: druidMap(),
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