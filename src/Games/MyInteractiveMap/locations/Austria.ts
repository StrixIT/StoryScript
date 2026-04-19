import {Location} from '../types';
import description from './Austria.html?raw';
import {Westphalia} from "./Westphalia.ts";
import {Franconia} from "./Franconia.ts";

export function Austria() {
    return Location({
        name: 'Austria',
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
        ]
    });
}
