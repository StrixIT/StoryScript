import { ClassType } from '../classType';
import { Enemy } from '../types';
import description from './Bandit.html?raw';

export function Bandit() {
    return Enemy({
        name: 'Bandit',
        description: description,
        damage: '1d6',
        defence: 2,
        speed: 5,
        hitpoints: 10,
        currency: 4,
        attackPriority: [
            [ClassType.Warrior, [1,2,3,4]],
            [ClassType.Wizard, [5,6]]
        ],
        activeDay: true
    });
}