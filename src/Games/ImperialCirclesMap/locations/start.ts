import { Location } from '../types'
import description from './Start.html?raw'
import {Westphalia} from "./Westphalia.ts";
import {Austria} from "./Austria.ts";
import {Franconia} from "./Franconia.ts";
import {Swabia} from "./Swabia.ts";

export function Start() {
    return Location({
        name: 'Start',
        description: description,
        destinations: [
            {
                name: 'Austria',
                target: Austria
            },
            {
                name: 'Franconia',
                target: Franconia
            },
            {
                name: 'Swabia',
                target: Swabia
            },
            {
                name: 'Westphalia',
                target: Westphalia
            }
        ]
    });
}
