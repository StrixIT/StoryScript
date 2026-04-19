import { Location } from '../types';
import description from './Swabia.html?raw';
import { Franconia } from "./Franconia";
import { Westphalia } from "./Westphalia";
import { Austria } from "./Austria";
import { Moser } from "../persons/Moser"; // Import Moser

export function Swabia() {
    return Location({
        name: 'Swabia',
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
                name: 'Westphalia',
                target: Westphalia
            }
        ],
        persons: [
            Moser() // Add Moser as a person in Swabia
        ]
    });
}
