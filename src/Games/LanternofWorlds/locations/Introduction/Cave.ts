import { Location } from '../../types';
import description from './Cave.html';
import { caveMap } from '../../maps/cave';
import { Cavebug } from '../../enemies/cavebug';

export function Cave() {
    return Location({
        name: 'Intro',
        description: description,
        features: caveMap(),
        enemies: [
            Cavebug()
        ]
    });
}