import { Location } from '../types';
import { Garden } from './Garden';
import { Journal } from '../items/journal';
import description from './Basement.html';

export function Basement() {
    return Location({
        name: 'Basement',
        description: description,
        destinations: [
            {
                name: 'To the garden',
                target: Garden
            }
        ],
        items: [
            Journal()
        ]
    });
}