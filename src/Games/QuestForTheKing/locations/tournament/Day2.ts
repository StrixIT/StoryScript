import { Location, IGame } from '../../types';
import description from './Day2.html';

export function Day2() {
    return Location({
        name: 'Day 2',
        description: description,
        enemies: [
            Nobleman()
        ],
        destinations: [
            {
                name: 'Night in your Tent',
                target: NightInYourTent
            },
            {

                name: 'Weapon Smith',
                target: WeaponSmith
            },
            {

                name: 'Healers Tent',
                target: HealersTent
            }

        ],
        enterEvents: [
            changeDay
        ]
    });
}