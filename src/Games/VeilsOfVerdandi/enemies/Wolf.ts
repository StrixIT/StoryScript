import { Enemy } from "../types";
import description from './Wolf.html?raw';
import {ClassType} from "../classType.ts";

export function Wolf() {
    return Enemy({
        name: 'Wolf',
        description: description,
        damage: '1d6',
        defence: 2,
        speed: 4,
        hitpoints: 10,
        currency: 1,
        attackPriority: [
            [ClassType.Warrior, [1,2,3]],
            [ClassType.Rogue, [4,5,6]]
        ],
        activeDay: true
    });
}