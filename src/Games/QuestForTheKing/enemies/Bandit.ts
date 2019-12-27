import { Enemy } from 'storyScript/Interfaces/storyScript';

export function Bandit() {
    return Enemy({
        name: 'Bandit',
        hitpoints: 14,
        attack: '1d4',
        reward: 1,
        activeDay: true
    });
}