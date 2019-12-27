import { Enemy } from 'storyScript/Interfaces/storyScript';

export function Farmboy() {
    return Enemy({
        name: 'Farmboy',
        hitpoints: 10,
        attack: '1d4',
        reward: 1,
        currency: 10
    });
}