import { Enemy } from "../types";

export function Brownbear() {
    return Enemy({
        name: 'Brown Bear',
        hitpoints: 20,
        damage: '1d8',
        reward: 2,
        activeDay: true
    });
}