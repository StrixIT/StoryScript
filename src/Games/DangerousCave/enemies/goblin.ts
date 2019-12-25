import { Enemy } from '../types';
import { Dagger } from '../items/dagger';

export function Goblin() {
    return Enemy({
        name: 'Goblin',
        hitpoints: 6,
        attack: 'd4+3',
        reward: 1,
        items: [
            Dagger()
        ]
    });
}