import { Enemy } from 'storyScript/Interfaces/storyScript';

export function Assassin() {
    return Enemy({
        name: 'Assassin',
        hitpoints: 12,
        attack: '1d4',
        reward: 1,                  
    });
}