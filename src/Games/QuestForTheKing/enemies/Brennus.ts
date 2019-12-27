import { Enemy } from 'storyScript/Interfaces/storyScript';

export function Brennus() {
    return Enemy({
        name: 'Brennus',
        hitpoints: 20,
        attack: '1d8',
        reward: 2
    });
}