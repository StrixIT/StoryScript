import { Location, IGame } from '../types';
import description from './Necromancer.html';
import { Quest1map4 } from './ForestOfMyrr/Quest1map4';
import { Necromancer as NecromancerEnemy } from '../enemies/Necromancer';

export function Necromancer() {
    return Location({
        name: 'The Necromancer',
        description: description,
        destinations: [
            {
                name: 'Back to the Map',
                target: Quest1map4
            }              
        ],
        enemies: [
            NecromancerEnemy()
        ]
    });
}