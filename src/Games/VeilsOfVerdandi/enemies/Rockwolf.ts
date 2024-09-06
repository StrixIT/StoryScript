import { Enemy } from "../types";

export function Rockwolf() {
    return Enemy({
        name: 'Rockwolf',
        hitpoints: 18,
        damage: '1d6',
        currency: 2
    });
}