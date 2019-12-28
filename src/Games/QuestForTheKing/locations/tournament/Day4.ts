import { Location, IGame } from '../../types';
import description from './Day4.html';

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