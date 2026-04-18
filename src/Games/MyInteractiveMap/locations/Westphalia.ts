import {Location} from '../types';
import description from './Westphalia.html?raw';
import {Austria} from "./Austria.ts";
import {Franconia} from "./Franconia.ts";

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
                name: 'Franconia',
                target: Franconia
            }
        ]
    });
}
