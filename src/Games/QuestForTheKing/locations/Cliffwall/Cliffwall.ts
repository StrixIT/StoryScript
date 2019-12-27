import { Location, IGame } from '../../types';
import description from './Cliffwall.html';

export function Cliffwall() {
    return Location({
        name: 'The Cliffwall',
        description: description,
        destinations: [
            {
                name: 'Back to the Map',
                target: Quest1map4
            },    
            {
                name: 'The Dark Cave',
                target: Darkcave
            }                                     
        ],
        enemies: [
            Twoheadedwolf()
        ]
    });
}
