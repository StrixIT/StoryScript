import { IGame, Location } from '../types';
import description from './Franconia.html?raw';
import { Westphalia } from "./Westphalia.ts";
import { Start } from "./start.ts";
import { Austria } from "./Austria.ts";

export function Franconia() {
    return Location({
        name: 'Franconia',
        description: description,
        destinations: [
            {
                name: 'Westphalia',
                target: Westphalia
            },
            {
                name: 'Austria',
                target: Austria
            },
            {
                name: 'Start',
                target: Start
            },
            // Add more destinations here as needed
        ]
    });
}
