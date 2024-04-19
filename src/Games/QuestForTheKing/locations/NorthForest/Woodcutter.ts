import { Location, IGame } from '../../types';
import description from './Woodcutter.html';
import { Start } from '../ForestEntry/start';
import { Ghost } from '../../enemies/Ghost';
import { Parchment } from '../../items/Parchment';
import { Bow } from '../../items/Bow';

export function Woodcutter() {
    return Location({
        name: 'The Woodcutters Cottage',
        description: description,
        destinations: [
            {
                name: 'Back to the Map',
                target: Start                       
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