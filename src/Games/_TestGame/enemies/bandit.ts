import { Enemy } from '../types';
import { Sword } from '../items/sword';
import { BasementKey } from '../items/basementKey';

export function Bandit() {
    return Enemy({
        name: 'Bandit',
        hitpoints: 10,
        attack: '1d6',
        items: [
            Sword(),
            BasementKey()
        ]
    });
}