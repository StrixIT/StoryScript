import { Enemy } from 'storyScript/Interfaces/storyScript';

export function Shieldmaiden() {
    return Enemy({
        name: 'Shieldmaiden',
        hitpoints: 18,
        attack: '1d8',
        reward: 1,
        currency: 30
    });
}