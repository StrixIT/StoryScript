import { IGame, Location } from '../types';
import description from './Franconia.html?raw';
import { Westphalia } from "./Westphalia.ts";
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
                name: 'Westphalia',
                target: Westphalia
            }
        ]
    });
}
