import { Location } from '../types'
import description from './Start.html'
import { Cave } from './Introduction/Cave';

export function Start() {
    return Location({
        name: 'Your adventure begins',
        description: description,
        enterEvents: [
            (game) => { game.changeLocation(Cave) }
        ],
        destinations: [
            
        ]
    });
}