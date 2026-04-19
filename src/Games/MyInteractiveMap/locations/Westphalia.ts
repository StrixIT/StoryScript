import {Location} from '../types';
import description from './Westphalia.html?raw';
import {Austria} from "./Austria.ts";
import {Franconia} from "./Franconia.ts";
import {Swabia} from "./Swabia.ts"; 

export function Westphalia() {
    return Location({
        name: 'Westphalia',
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
                name: 'Franconia',
                target: Franconia
            }
        ]
    });
}
