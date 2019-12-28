import { Enemy } from 'storyScript/Interfaces/storyScript';
import description from './Shieldmaiden.html';

export function Shieldmaiden() {
    return Enemy({
        name: 'Shieldmaiden',
        description: description,
        hitpoints: 18,
        attack: '1d8',
        reward: 1,
        currency: 30
    });
}