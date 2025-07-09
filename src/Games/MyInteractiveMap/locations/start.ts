import { Location } from '../types'
import description from './Start.html?raw'
import {Westphalia} from "./Westphalia.ts";
import {Carinthia} from "./Carinthia.ts";

export function Start() {
    return Location({
        name: 'Start',
        description: description,
        destinations: [
            {
                name: 'Westphalia',
                target: Westphalia
            },
            {
                name: 'Carinthia',
                target: Carinthia
            },
        ]
    });
}