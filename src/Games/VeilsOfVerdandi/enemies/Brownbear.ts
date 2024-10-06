import { Enemy } from "../types";
import description from './Brownbear.html?raw';
import {ClassType} from "../classType.ts";

export function Brownbear() {
    return Enemy({
        name: 'Brown Bear',
        description: description,
        damage: '1d8',
        defence: 2,
        speed: 6,
        hitpoints: 18,
        currency: 2,
        attackPriority: [
            [ClassType.Warrior, [1,2,3,4]],
            [ClassType.Rogue, [5,6]]
        ],
        activeDay: true
    });
}