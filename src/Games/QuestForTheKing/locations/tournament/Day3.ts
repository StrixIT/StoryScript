import { Location, IGame } from '../../types';
import description from './Day3.html';

export function Day3() {
    return Location({
        name: 'Day 3',
        description: description,
        destinations: [
            {
                name: 'Day 4',
                target: Day4
            },
            {

                name: 'Weapon Smith',
                target: WeaponSmith
            },
            {

                name: 'Healers Tent',
                target: HealersTent
            },
        ],
        enemies: [
            Shieldmaiden()
        ],
        enterEvents: [
            changeDay
        ]
    });
}