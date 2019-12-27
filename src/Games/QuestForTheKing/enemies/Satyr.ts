import { Enemy } from 'storyScript/Interfaces/storyScript';

export function Satyr() {
    return Enemy({
        name: 'Satyr',
        hitpoints: 18,
        attack: '1d6',
        reward: 2
    });
}