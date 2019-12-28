import { Location, IGame } from '../../types';
import description from './Start.html';
import { Day1 } from './Day1';

export function Start() {
    return Location({
        name: 'Start',
        description: description,
        destinations: [
            {
                name: 'Day 1',
                target: Day1
            }
        ]
    });
}