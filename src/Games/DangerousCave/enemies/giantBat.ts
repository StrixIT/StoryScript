import { Enemy } from '../types';

export function GiantBat() {
    return Enemy({
        name: 'Reuzenvleermuis',
        hitpoints: 7,
        attack: '1d6',
        reward: 1
    });
}