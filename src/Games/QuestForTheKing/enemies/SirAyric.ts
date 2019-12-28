import { Enemy } from 'storyScript/Interfaces/storyScript';
import description from './SirAyric.html';

export function SirAyric() {
    return Enemy({
        name: 'Sir Ayric',
        description: description,
        hitpoints: 20,
        attack: '1d8',
        reward: 1
    });
}