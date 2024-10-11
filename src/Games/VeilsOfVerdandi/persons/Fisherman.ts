import {Person} from '../types';
import description from './Fisherman.html?raw';
import {ColdIronAxe} from "../items/ColdIronAxe.ts";
import {Cutlass} from "../items/Cutlass.ts";

export function Fisherman() {
    return Person({
        name: 'FisherMan',
        description: description,
        hitpoints: 10,
        canAttack: false,
        items: [
            ColdIronAxe(),
            Cutlass()
        ]
    });
}