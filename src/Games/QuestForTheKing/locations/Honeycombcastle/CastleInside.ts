import { Location, IGame } from '../../types';
import description from './CastleInside.html';
import { Quest1map2 } from '../ForestOfMyrr/Quest1map2';
import { QueenBee } from '../../persons/queenBee';

export function CastleInside() {
    return Location({
        name: 'Entering the Castle',
        description: description,
        destinations: [
            {
                name: 'Back to the Map',
                target: Quest1map2
            }
        ],
        persons: [
            QueenBee()
        ]
    });
}