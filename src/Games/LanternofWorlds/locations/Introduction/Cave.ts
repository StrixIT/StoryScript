import { Location } from '../../types';
import description from './Cave.html';
import { caveMap } from '../../maps/cave';

export function Cave() {
    return Location({
        name: 'Intro',
        description: description,
        features: caveMap()
    });
}