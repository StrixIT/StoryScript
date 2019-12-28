import { Location, IGame } from '../../types';
import description from './Quest1map4.html';
import { Necromancer } from '../Necromancer/Necromancer';
import { Darkmagic } from '../Darkmagic/Darkmagic';
import { Guardians } from '../Treeguardians/Guardians';
import { Quest1map3 } from './Quest1map3';
import { Quest1map1 } from './Quest1map1';

export function Quest1map4() {
    return Location({
        name: 'The Southern Forest',
        description: description,
        destinations: [
            
                {                          
                name: 'The Necromancer',
                target: Necromancer
            },
                {                          
                    name: 'Dark Magic',
                    target: Darkmagic
                },
                {                          
                    name: 'The Strange Trees',
                    target: Guardians
                },
                {                          
                    name: 'Go to the Eastern Forest',
                    target: Quest1map3,
                    style: 'location-danger'
                },     
                {                          
                    name: 'Go to the Western Forest',
                    target: Quest1map1,
                    style: 'location-danger'
                }    
        ]
    });
}