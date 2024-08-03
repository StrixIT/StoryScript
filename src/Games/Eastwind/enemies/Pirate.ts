import {Enemy} from '../types';
import description from './Pirate.html';

export function Pirate() {
    return Enemy({
        name: 'Pirate',
        description: description,
        hitpoints: 10,
        items: [],
    });
}