import {Enemy} from "../types";
import description from './Brownbear.html?raw';
import {ClassType} from "../classType.ts";

export function Brownbear() {
    return Enemy({
        name: 'Brown Bear',
        description: description,
        hitpoints: 18,
        defence: 2,
        currency: 2,
        attacks: [
            {
                damage: '1d8',
                speed: 6,
                attackPriority: [
                    [ClassType.Warrior, [1, 2, 3, 4]],
                    [ClassType.Rogue, [5, 6]]
                ]
            }
        ],
        activeDay: true
    });
}