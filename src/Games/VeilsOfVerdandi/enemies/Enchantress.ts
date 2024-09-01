import { Enemy } from "../types";

export function Enchantress() {
    return Enemy({
        name: 'The Enchantress',
        hitpoints: 20,
        damage: '1d8',
        reward: 5
    });
}