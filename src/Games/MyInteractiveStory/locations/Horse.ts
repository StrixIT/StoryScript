import { Location } from '../types';
import description from './Horse.html?raw';

export function Horse() {
    return Location({
        name: 'A horse',
        description: description,
        destinations: [
            
        ]
    });
}