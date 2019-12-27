import { Location, IGame } from '../../types';
import description from './Woodcutter.html';

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