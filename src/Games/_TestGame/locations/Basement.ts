import { Location } from '../interfaces/types';
import { RegisterLocation } from '../../../Engine/Interfaces/storyScript'
import { Garden } from './Garden';
import { Journal } from '../items/journal';
import description from './Basement.html';

export function Basement() {
    return Location({
        name: 'Basement',
        html: description,
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

RegisterLocation(Basement);