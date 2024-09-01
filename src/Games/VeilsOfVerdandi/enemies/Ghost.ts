import { Enemy } from "../types";

export function Ghost() {
    return Enemy({
        name: 'Wraith',
        hitpoints: 14,
        damage: '1d4',
        reward: 1,
        activeNight: true
    });
}