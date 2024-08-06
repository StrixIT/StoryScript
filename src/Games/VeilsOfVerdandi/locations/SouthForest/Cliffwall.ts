import { Location, IGame } from '../../types';
import description from './Cliffwall.html';
import { Darkcave } from './Darkcave';
import { Twoheadedwolf } from '../../enemies/Twoheadedwolf';
import { Guardians } from './Guardians';

export function Cliffwall() {
    return Location({
        name: 'The Cliffwall',
        description: description,
        destinations: [
			{                          
				name: 'The Strange Trees',
				target: Guardians
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
