import { Location, IGame } from '../../types';
import description from './Honeycastle.html';
import { Quest1map2 } from '../Maps/Quest1map2';
import { Castleapproach } from './Castleapproach';

export function Honeycastle() {
    return Location({
        name: 'The Honeycomb Castle',
        description: description,
        destinations: [
            {
                name: 'Back to the Map',
                target: Quest1map2
            },   
            {
                name: 'Approach the Castle',
                target: Castleapproach
            }            
        ],             
    });
}