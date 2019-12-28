import { Location, IGame } from '../../types';
import description from './Day2.html';
import { Nobleman } from '../../enemies/Nobleman';
import { NightInYourTent } from './NightInYourTent';
import { WeaponSmith } from './WeaponSmith';
import { HealersTent } from './HealersTent';
import { changeDay } from '../../gameFunctions';

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