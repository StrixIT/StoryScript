import { Location, IGame } from '../../types';
import description from './Castleapproach.html';
import { Quest1map2 } from '../ForestOfMyrr/Quest1map2';
import { CastleInside } from './CastleInside';

export function Castleapproach() {
    return Location({
        name: 'Approaching the Castle',
        description: description,
        destinations: [
            {
                name: 'Back to the Map',
                target: Quest1map2
            },     
            {
                name: 'Enter the Castle',
                target: CastleInside
            }          
        ],             
    });
}