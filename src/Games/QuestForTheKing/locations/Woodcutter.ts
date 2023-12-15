import { Location, IGame } from '../types';
import description from './Woodcutter.html';
import { Quest1map1 } from './ForestOfMyrr/Quest1map1';
import { Ghost } from '../enemies/Ghost';
import { Parchment } from '../items/Parchment';
import { Bow } from '../items/Bow';

export function Woodcutter() {
    return Location({
        name: 'The Woodcutters Cottage',
        description: description,
        destinations: [
            {
                name: 'Back to the Map',
                target: Quest1map1                       
            }
        ],
        enemies: [
            Ghost()
        ],
        items: [
            Parchment(),
            Bow(),
        ]
    });
}