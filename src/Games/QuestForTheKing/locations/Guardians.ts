import { Location, IGame } from '../types';
import description from './Guardians.html';
import { Quest1map4 } from './ForestOfMyrr/Quest1map4';
import { Cliffwall } from './Cliffwall';
import { Parchment } from '../items/Parchment';

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