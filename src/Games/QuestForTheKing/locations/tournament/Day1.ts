import { Location, IGame } from '../../types';
import description from './Day1.html';

export function Day1() {
    return Location({
        name: 'Day 1',
        description: description,
        destinations: [
            {
                name: 'Day 2',
                target: Day2
            },
            {

                name: 'Weapon Smith',
                target: WeaponSmith
            },
            {

                name: 'The Storyteller',
                target: Fasold1
            },
            {

                name: 'Healers Tent',
                target: HealersTent
            }

        ],
        enemies: [
            Farmboy()
        ],
        enterEvents: [
            changeDay
        ]
    });
}