import { Location, IGame } from '../../types';
import description from './ForestPond.html';

export function Magicflowers() {
    return Location({
        name: 'The Magic Flowers',
        description: description,
        destinations: [
            {
                name: 'Back to the Map',
                target: Quest1map2
            }              
        ],            
        enemies: [
            Brownbear()

        ],
        items: [
            Magicflower(),                
        ]
    });
}