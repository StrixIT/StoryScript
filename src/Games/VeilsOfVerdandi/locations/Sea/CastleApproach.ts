import {Location} from '../../types';
import description from './CastleApproach.html?raw';
import {CastleInside} from "./CastleInside.ts";

export function CastleApproach() {
    return Location({
        name: 'Honeycomb Castle Approach',
        description: description,
        destinations: [
            {
                name: 'Enter the Castle',
                target: CastleInside,
                style: 'location-danger'
            }
        ]
    });
}