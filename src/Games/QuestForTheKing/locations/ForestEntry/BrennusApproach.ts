import { Location, IGame } from '../../types';
import description from './BrennusApproach.html';
import { Brennus } from '../../enemies/Brennus';
import { Start } from './start';

export function BrennusApproach() {
    return Location({
        name: 'Brennus',
        description: description,
        destinations: [
            {
                name: 'Back to the Map',
                target: Start
            }
        ],
        enemies: [
            Brennus()
        ]
    });
}