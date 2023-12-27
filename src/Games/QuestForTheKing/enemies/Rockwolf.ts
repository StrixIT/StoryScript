import { Enemy } from 'storyScript/Interfaces/storyScript';

export function Rockwolf() {
    return Enemy({
        name: 'Rockwolf',
        hitpoints: 18,
        damage: '1d6',
        reward: 2
    });
}