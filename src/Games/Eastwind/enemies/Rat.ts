import {Enemy} from '../types';
import description from './Rat.html';

export function Rat() {
    return Enemy({
        name: 'Rat',
        description: description,
        hitpoints: 300,
        attack: '1d2',
        attackSound: 'Rat.mp3',
        attackText: 'The rat attacks!',
        items: [],
    });
}