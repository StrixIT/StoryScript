import { Enemy } from "../types";
import description from './Wolf.html?raw';
import {ClassType} from "../classType.ts";

export function Wolf() {
    return Enemy({
        name: 'Wolf',
        description: description,
        attacks: [{
            damage: '1d6',
            speed: 4,attackPriority: [
                [ClassType.Warrior, [1,2,3]],
                [ClassType.Rogue, [4,5,6]]
            ],
        }],
        defence: 2,
        hitpoints: 10,
        currency: 1,
        activeDay: true
    });
}