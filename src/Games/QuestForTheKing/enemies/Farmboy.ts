import { Enemy } from 'storyScript/Interfaces/storyScript';
import description from './Farmboy.html';

export function Farmboy() {
    return Enemy({
        name: 'Farmboy',
        description: description,
        hitpoints: 10,
        attack: '1d4',
        reward: 1,
        currency: 10
    });
}