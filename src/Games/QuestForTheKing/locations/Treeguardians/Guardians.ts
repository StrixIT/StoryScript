import { Location, IGame } from '../../types';
import description from './Guardians.html';

export function Guardians() {
    return Location({
        name: 'The Strange Trees',
        description: description,
        destinations: [
            {
                name: 'Back to the Map',
                target: Quest1map4
            },    
            {
                name: 'To the Cliffwall',
                target: Cliffwall,
                barrier: {
                    name: 'Wall of branches',
                    key: Parchment
                }
            }                                     
        ]
    });
}