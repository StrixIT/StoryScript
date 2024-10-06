import { Enemy } from "../types";
import description from './Spectre.html?raw';
import {ClassType} from "../classType.ts";

export function Spectre() {
    return Enemy({
        name: 'Spectre',
        description: description,
        // Todo: damage is magical, add fright
        damage: '1d4',
        defence: 4,
        speed: 5,
        hitpoints: 15,
        currency: 4,
        attackPriority: [
            [ClassType.Wizard, [1,2,3,4]],
            [ClassType.Warrior, [5,6]]
        ],
        activeNight: true
    });
}