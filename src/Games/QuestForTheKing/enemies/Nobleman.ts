import { Enemy } from 'storyScript/Interfaces/storyScript';
import description from './Nobleman.html';

export function Nobleman() {
    return Enemy({
        name: 'Nobleman',
        description: description,
        hitpoints: 14,
        attack: '1d4',
        reward: 1,
        currency: 15
    });
}