import { Location, IGame } from '../../types';
import description from './Darkmagic.html';

export function Darkmagic() {
    return Location({
        name: 'Dark Magic',
        description: description,
        destinations: [
            {
                name: 'Back to the Map',
                target: Quest1map4
            }              
        ],
        enemies: [
            Mirrorimage()             
        ]
    });
}