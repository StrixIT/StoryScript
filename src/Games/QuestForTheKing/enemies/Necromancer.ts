import { Enemy } from 'storyScript/Interfaces/storyScript';

export function Necromancer() {
    return Enemy({
        name: 'The Necromancer',
        hitpoints: 16,
        damage: '1d8',
        reward: 3
    });
}