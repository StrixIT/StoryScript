import { Enemy } from "../types";

export function Wolf() {
    return Enemy({
        name: 'Wolf',
        hitpoints: 10,
        damage: '1d4',
        currency: 1,
        activeDay: true
    });
}