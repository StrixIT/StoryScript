import { Location, IGame } from '../../types';
import description from './FasoldStoryteller.html';
import { Day2 } from './Day2';
import { WeaponSmith } from './WeaponSmith';
import { HealersTent } from './HealersTent';
import { Fasold } from '../../persons/fasold';

export function FasoldStoryteller() {
    return Location({
        name: 'Fasold the Storyteller',
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
                name: 'Healers Tent',
                target: HealersTent
            } 
        ],
        persons: [
            Fasold()
        ]
    });
}