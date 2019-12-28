import { Location, IGame } from '../../types';
import description from './NightInYourTent.html';
import { custom } from 'storyScript/utilities';
import { Day3 } from './Day3';

export function NightInYourTent() {
    return Location({
        name: 'Night in your tent',
        description: description,
        destinations: [
            {
                name: 'Day 3',
                target: Day3
            }
        ],
        enemies: [
            custom(Assassin, { name: 'Female Assassin' }),
            custom(Assassin, { name: 'Male Assassin' })
        ]
    });
}