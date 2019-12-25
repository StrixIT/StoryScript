import { Location } from '../types';
import description from './Start.html';
import { Clearing } from './clearing';
import { Horse } from './Horse';

export function Start() {
    return Location({
        name: 'A forest clearing',
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
        ],
        features: [
        ],
        items: [
        ],
        enemies: [
        ],
        persons: [
        ],
        enterEvents: [
        ],
        leaveEvents: [
        ],
        actions: [
        ],
        combatActions: [
        ],
    });
}