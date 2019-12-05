import { Location } from '../types';
import { Fountain } from '../features/fountain';
import description from './Start.html';

export function Start() {
    return Location({
        name: 'Start',
        html: description,
        features: [
            Fountain()
        ]
    });
}