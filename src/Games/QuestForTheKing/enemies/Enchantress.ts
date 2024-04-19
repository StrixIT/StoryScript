import { Enemy } from 'storyScript/Interfaces/storyScript';

export function Enchantress() {
    return Enemy({
        name: 'The Enchantress',
        hitpoints: 20,
        damage: '1d8',
        reward: 5
    });
}