import {Location} from '../../types';
import description from './Honeycastle.html?raw';
import {CastleInside} from "./CastleInside.ts";

export function Honeycastle() {
    return Location({
        name: 'The Honeycomb Castle',
        description: description,
        destinations: [
            {
                name: 'Enter the Castle',
                target: CastleInside,
                style: 'location-danger'
            }
        ],
    });
}