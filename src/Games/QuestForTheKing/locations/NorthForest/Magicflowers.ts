import { Location, IGame } from '../../types';
import description from './Magicflowers.html';
import { Brownbear } from '../../enemies/Brownbear';
import { Magicflower } from '../../items/Magicflower';

export function Magicflowers() {
    return Location({
        name: 'The Magic Flowers',
        description: description,
        destinations: [
            {
                name: 'Back to the Map',
                target: null
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