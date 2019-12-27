import { Location, IGame } from '../../types';
import description from './Dryadreturn.html';

export function Dryadreturn() {
    return Location({
        name: 'The Dryad Tree',
        description: description,
        destinations: [
            {
                name: 'Back to the Map',
                target: Quest1map3
            }           
        ]
    });
}