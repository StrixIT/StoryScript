import {Location} from '../../types';
import description from './Castleapproach.html?raw';
import {Honeycastle} from "./Honeycastle.ts";

export function Castleapproach() {
    return Location({
        name: 'Approaching the Castle',
        description: description,
        destinations: [
            {
                name: 'Enter the Castle',
                target: Honeycastle
            }
        ]
    });
}