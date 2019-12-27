import { Enemy } from 'storyScript/Interfaces/storyScript';

export function Wolf() {
    return Enemy({
        name: 'Wolf',
        hitpoints: 10,
        attack: '1d4',
        reward: 1
    });
}