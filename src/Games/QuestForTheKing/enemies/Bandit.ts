import { Enemy } from 'storyScript/Interfaces/storyScript';
import { ClassType } from '../classType';

export function Bandit() {
    return Enemy({
        name: 'Bandit',
        damage: '1d6',
        defence: 2,
        speed: 5,
        hitpoints: 10,
        reward: 4,
        attackPriority: [
            { [ClassType.Warrior]: [1,2,3,4] },
            { [ClassType.Wizard]: [5,6] }
        ],
        activeDay: true
    });
}