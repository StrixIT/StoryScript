import { ClassType } from '../classType';
import { Enemy } from '../types';
import description from './Bandit.html?raw';

export function Bandit() {
    return Enemy({
        name: 'Bandit',
        description: description,
        damage: '1d6',
        defence: 2,
        speed: 4,
        hitpoints: 12,
        currency: 1,
        attackPriority: [
            [ClassType.Rogue, [1,2,3,4]],
            [ClassType.Wizard, [5,6]]
        ],
        activeDay: true
    });
}