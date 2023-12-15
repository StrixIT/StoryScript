import { Location, IGame } from '../types';
import description from './Magicflowers.html';
import { Quest1map2 } from './ForestOfMyrr/Quest1map2';
import { Brownbear } from '../enemies/Brownbear';
import { Magicflower } from '../items/Magicflower';

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