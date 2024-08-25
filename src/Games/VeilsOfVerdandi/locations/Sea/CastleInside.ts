import { Location, IGame } from '../../types';
import description from './CastleInside.html?raw';
import { QueenBee } from '../../persons/queenBee';

export function CastleInside() {
    return Location({
        name: 'Entering the Castle',
        description: description,
        destinations: [
            {
                name: 'Back to the Map',
                target: null
            }
        ],
        persons: [
            QueenBee()
        ]
    });
}