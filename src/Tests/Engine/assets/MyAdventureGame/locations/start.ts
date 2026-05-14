import { Location } from '../types';
import { Fountain } from '../features/fountain';
import description from './Start.html?raw';

export function Start() {
    return Location({
        name: 'Start',
        description: description,
        features: [
            Fountain()
        ]
    });
}