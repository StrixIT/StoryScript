import { Enemy } from 'storyScript/Interfaces/storyScript';

export function Satyr() {
    return Enemy({
        name: 'Satyr',
        hitpoints: 18,
        damage: '1d6',
        reward: 2
    });
}