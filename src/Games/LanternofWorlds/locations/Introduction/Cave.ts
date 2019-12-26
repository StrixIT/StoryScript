import { Location } from '../../types';
import description from './Cave.html';
import { caveMap } from '../../maps/cave';
import { Bat } from '../../enemies/bat';

export function Cave() {
    return Location({
        name: 'Intro',
        description: description,
        features: caveMap(),
        enemies: [
            Bat()
        ]
    });
}