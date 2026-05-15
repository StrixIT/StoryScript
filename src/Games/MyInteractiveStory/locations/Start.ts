import { Location } from '../types';
import description from './Start.html?raw';
import { Clearing } from './clearing';
import { Horse } from './Horse';

export function Start() {
    return Location({
        name: 'Awakening',
        description: description,
        destinations: [
            {
                name: 'Walk towards the clearing',
                target: Clearing,
            },
            {
                name: 'Approach the horse',
                target: Horse,
            }
        ]
    });
}