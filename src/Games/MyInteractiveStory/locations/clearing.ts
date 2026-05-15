import { Location } from '../types';
import description from './Clearing.html?raw';
import {GrabSword} from "./GrabSword.ts";
import {FleeOnFoot} from "./FleeOnFoot.ts";

export function Clearing() {
    return Location({
        name: 'A clearing between the trees',
        description: description,
        destinations: [
            {
                name: 'Grab the metal',
                target: GrabSword
            },
            {
                name: 'Run away',
                target: FleeOnFoot
            }
        ]
    });
}