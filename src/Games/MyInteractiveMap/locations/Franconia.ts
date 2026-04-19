import { IGame, Location } from '../types';
import description from './Franconia.html?raw';
import { Westphalia } from "./Westphalia.ts";
import { Swabia } from "./Swabia.ts";
import { Austria } from "./Austria.ts";

export function Franconia() {
    return Location({
        name: 'Franconia',
        description: description,
        destinations: [
            {
                name: 'Austria',
                target: Austria
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
