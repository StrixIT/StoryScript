import { Location, IGame } from '../../types';
import description from './Fisherman.html';
import { Quest1map2 } from '../Maps/Quest1map2';

export function Fisherman() {
    return Location({
        name: 'The Fishermans Cottage',
        description: description,
        destinations: [
            {
                name: 'Back to the Map',
                target: Quest1map2
            }                                       
        ]
    });
}