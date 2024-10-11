import {Enemy} from "../types";
import {ClassType} from "../classType.ts";

export function Troll() {
    return Enemy({
        name: 'Troll',
        hitpoints: 35,
        defence: 1,
        currency: 15,
        attacks: [
            {
                damage: '2d6',
                speed: 8,
                attackPriority: [
                    [ClassType.Warrior, [1,2,3,4]],
                    [ClassType.Rogue, [5,6]]
                ]
            }
        ]
    });
}