import { Enemy } from '../types';
import { Sword } from '../items/sword';
import { BasementKey } from '../items/basementKey';
import description from './bandit.html';

export function Bandit() {
    return Enemy({
        name: 'Bandit',
        description: description,
        hitpoints: 10,
        attack: '1d6',
        items: [
            Sword(),
            BasementKey()
        ]
    });
}