import { Location, IGame } from '../../types';
import description from './Guardians.html';
import { Cliffwall } from './Cliffwall';
import { Parchment } from '../../items/Parchment';
import { SouthRoad } from './SouthRoad';

export function Guardians() {
    return Location({
        name: 'The Strange Trees',
        description: description,
        destinations: [
            {
                name: 'The Southern Road',
                target: SouthRoad
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