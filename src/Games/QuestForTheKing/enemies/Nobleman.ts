import { Enemy } from 'storyScript/Interfaces/storyScript';

export function Nobleman() {
    return Enemy({
        name: 'Nobleman',
        hitpoints: 14,
        attack: '1d4',
        reward: 1,
        currency: 15
    });
}