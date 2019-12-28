import { Location, IGame } from '../../types';
import description from './Cliffwall.html';
import { Quest1map4 } from '../Maps/Quest1map4';
import { Darkcave } from '../Darkcave/Darkcave';
import { Twoheadedwolf } from '../../enemies/Twoheadedwolf';

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
