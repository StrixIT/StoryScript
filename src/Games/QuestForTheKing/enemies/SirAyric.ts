import { Enemy } from 'storyScript/Interfaces/storyScript';

export function SirAyric() {
    return Enemy({
        name: 'Sir Ayric',
        hitpoints: 20,
        attack: '1d8',
        reward: 1
    });
}