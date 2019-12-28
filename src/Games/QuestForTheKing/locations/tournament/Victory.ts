import { Location, IGame } from '../../types';
import description from './Victory.html';
import { Start } from './start';
import { Quest1 } from '../Quest1';

export function Victory() {
    return Location({
        name: 'Victory',
        description: description,
        destinations: [
            {
                name: 'Start again',
                target: Start
            },
            {
                name: 'Start your first Quest',
                target: Quest1,
                style: 'location-danger'
            }
        ]           
    });
}