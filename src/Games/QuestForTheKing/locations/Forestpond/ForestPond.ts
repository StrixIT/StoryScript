import { Location, IGame } from '../../types';
import description from './ForestPond.html';

export function ForestPond() {
    return Location({
        name: 'The Forest Pond',
        description: description,
        destinations: [
            {
                name: 'Back to the Map',
                target: Quest1map2
            }              
        ],
        enemies: [
            DarkDryad()
        ],
        items: [
            Magicshield(),
        ]
    });
}