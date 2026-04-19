import { Location } from '../types';
import description from './Swabia.html?raw';
import { Franconia } from "./Franconia.ts";
import { Westphalia } from "./Westphalia.ts";
import { Austria } from "./Austria.ts";

export function Swabia() {
    return Location({
        name: 'Swabia',
        description: description,
        destinations: [
            {
                name: 'Franconia',
                target: Franconia
            },
            {
                name: 'Westphalia',
                target: Westphalia
            },
            {
                name: 'Austria',
                target: Austria
            },
            // Add more destinations here as needed
        ]
    });
}
