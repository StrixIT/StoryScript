import { Enemy } from "../types";
import description from './Wolf.html?raw';

export function Wolf() {
    return Enemy({
        name: 'Wolf',
        hitpoints: 10,
        description: description,
        damage: '1d4',
        currency: 1,
        activeDay: true
    });
}