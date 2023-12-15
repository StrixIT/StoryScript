import { Location, IGame } from '../types';
import description from './BrennusApproach.html';
import { Start } from './ForestOfMyrr/start';
import { Brennus } from '../enemies/Brennus';

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