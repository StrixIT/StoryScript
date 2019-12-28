import { Location, IGame } from '../../types';
import description from './Day1.html';
import { Day2 } from './Day2';
import { WeaponSmith } from './WeaponSmith';
import { HealersTent } from './HealersTent';
import { Farmboy } from '../../enemies/Farmboy';
import { changeDay } from '../../gameFunctions';
import { FasoldStoryteller } from './FasoldStoryteller';

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
                target: FasoldStoryteller
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