import { Location } from '../interfaces/types';
import { RegisterLocation } from '../../../Engine/Interfaces/storyScript'
import { Garden } from './Garden';
import { Journal } from '../items/journal';

export function Basement() {
    return Location({
        name: 'Basement',
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