import { ClassType } from '../classType';
import { Enemy } from '../types';

export function Brennus() {
    return Enemy({
        name: 'Brennus',
        damage: '1d8',
        defence: 3,
        speed: 5,
        hitpoints: 18,
        reward: 5,
        attackPriority: [
            [ClassType.Warrior, [1,2,3,4]],
            [ClassType.Wizard, [5,6]]
        ]
    });
}