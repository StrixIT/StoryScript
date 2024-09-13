import { Enemy } from "../types";
import description from './Wolf.html?raw';

export function Ghost() {
    return Enemy({
        name: 'Ghost',
        description: description,
        hitpoints: 14,
        damage: '1d4',
        currency: 1,
        activeNight: true
    });
}