import { Enemy } from "../types";
import description from './Brownbear.html?raw';

export function Brownbear() {
    return Enemy({
        name: 'Brown Bear',
        hitpoints: 20,
        description: description,
        damage: '1d8',
        currency: 2,
        activeDay: true
    });
}