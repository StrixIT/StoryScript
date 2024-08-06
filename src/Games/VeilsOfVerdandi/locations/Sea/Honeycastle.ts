import { Location, IGame } from '../../types';
import description from './Honeycastle.html';
import { Castleapproach } from './Castleapproach';
import { Fisherman } from '../NorthForest/Fisherman';
import { Octopus } from './Octopus';

export function Honeycastle() {
    return Location({
        name: 'The Honeycomb Castle',
        description: description,
        destinations: [
            {
                name: 'Approach the Castle',
                target: Castleapproach
            },            
            {
                name: 'The Fisherman\'s cottage',
                target: Fisherman,
                style: 'location-water'
            },
            {                          
                name: 'The Octopus',
                target: Octopus,
                style: 'location-water'
            },
                 
        ],             
    });
}