import { Location, IGame } from '../types';
import description from './Darkmagic.html';
import { Quest1map4 } from './ForestOfMyrr/Quest1map4';
import { Mirrorimage } from '../enemies/Mirrorimage';

export function Darkmagic() {
    return Location({
        name: 'Dark Magic',
        description: description,
        destinations: [
            {
                name: 'Back to the Map',
                target: Quest1map4
            }              
        ],
        enemies: [
            Mirrorimage()             
        ]
    });
}