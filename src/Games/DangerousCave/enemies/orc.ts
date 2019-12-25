import { Enemy } from '../types';
import { IronHelmet } from '../items/ironHelmet';

export function Orc() {
    return Enemy({
        name: 'Ork',
        hitpoints: 12,
        attack: '2d4+1',
        reward: 1,
        items: [
            IronHelmet()
        ]
    });
}