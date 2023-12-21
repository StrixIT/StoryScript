import { Location, IGame } from '../../types';
import description from './Castleapproach.html';
import { CastleInside } from './CastleInside';

export function Castleapproach() {
    return Location({
        name: 'Approaching the Castle',
        description: description,
        destinations: [
            {
                name: 'Back to the Map',
                target: null
            },     
            {
                name: 'Enter the Castle',
                target: CastleInside
            }          
        ],             
    });
}