import { Enemy } from "../types";

export function DarkDryad() {
    return Enemy({
        name: 'The Dark Dryad',
        hitpoints: 20,
        damage: '1d6',
        currency: 3
    });
}