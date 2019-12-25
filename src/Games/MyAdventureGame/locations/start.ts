import { Location } from '../types';
import { Fountain } from '../features/fountain';
import description from './Start.html';

export function Start() {
    return Location({
        name: 'Start',
        description: description,
        features: [
            Fountain()
        ]
    });
}