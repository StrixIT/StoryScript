import { Location } from '../types';
import description from './Horse.html?raw';
import {FleeOnHorse} from "./FleeOnHorse.ts";
import {GrabSword} from "./GrabSword.ts";

export function Horse() {
    return Location({
        name: 'A horse',
        description: description,
        destinations: [
            {
                name: 'Ride off on horseback',
                target: FleeOnHorse
            },
            {
                name: 'Grab the sword',
                target: GrabSword
            }
        ]
    });
}