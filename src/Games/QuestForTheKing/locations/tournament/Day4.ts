import { Location, IGame } from '../../types';
import description from './Day4.html';
import { Victory } from './Victory';
import { SirAyric } from '../../enemies/SirAyric';
import { changeDay } from '../../gameFunctions';

export function Day4() {
    return Location({
        name: 'Day 4',
        description: description,
        destinations: [
            {
                name: 'To the feast',
                target: Victory
            }
        ],
        enemies: [
            SirAyric()
        ],
        enterEvents: [
            changeDay
        ]
    });
}