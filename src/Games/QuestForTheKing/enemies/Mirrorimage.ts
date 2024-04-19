import { Enemy } from 'storyScript/Interfaces/storyScript';

export function Mirrorimage() {
    return Enemy({
        name: 'Mirror Image',
        hitpoints: 15,
        damage: '1d6',
        reward: 1
    });
}