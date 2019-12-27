import { Location, IGame } from '../../types';
import description from './BrennusApproach.html';
import { Brennus } from './Brennus';

export function BrennusApproach() {
    return Location({
        name: 'Brennus',
        description: description,
        destinations: [
            {
                name: 'Back to the Map',
                target: Quest1map1
            }
        ],
        enemies: [
            Brennus()
        ]
    });
}