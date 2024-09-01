import { Location, IGame } from '../../types';
import description from './Magicflowers.html?raw';
import { Brownbear } from '../../enemies/Brownbear';
import { Magicflower } from '../../items/Magicflower';
import { NorthRoad } from './NorthRoad';

export function Magicflowers() {
    return Location({
        name: 'The Magic Flowers',
        description: description,
        destinations: [
            {
                name: 'Back to the Map',
                target: NorthRoad
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