import { Location, IGame } from '../../types';
import description from './Dryad.html';
import { Quest1map3 } from '../Maps/Quest1map3';

export function Dryad() {
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