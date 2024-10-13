import {Location} from '../../types';
import description from './IslandMeadow.html?raw';
import {CastleApproach} from "./CastleApproach.ts";

export function IslandMeadow() {
    return Location({
        name: 'The Island Meadow',
        description: description,
        destinations: [
            {
                name: 'Approach the Castle',
                target: CastleApproach
            }
        ],
    });
}