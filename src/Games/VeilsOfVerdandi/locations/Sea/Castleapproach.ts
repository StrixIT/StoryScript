import { Location, IGame } from '../../types';
import description from './Castleapproach.html?raw';
import { CastleInside } from './CastleInside';
import { Honeycastle } from './Honeycastle';

export function Castleapproach() {
    return Location({
        name: 'Approaching the Castle',
        description: description,
        destinations: [
            {
                name: 'Back to the Map',
                target: Honeycastle
            },     
            {
                name: 'Enter the Castle',
                target: CastleInside
            }          
        ],             
    });
}