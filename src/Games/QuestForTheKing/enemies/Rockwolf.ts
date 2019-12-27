import { Enemy } from 'storyScript/Interfaces/storyScript';

export function Rockwolf() {
    return Enemy({
        name: 'Rockwolf',
        hitpoints: 18,
        attack: '1d6',
        reward: 2
    });
}