﻿import { Location, IGame } from '../../types';
import description from './Quest1map4.html';
import { Necromancer } from '../Necromancer';
import { Darkmagic } from '../Darkmagic';
import { Guardians } from '../Guardians';
import { Quest1map3 } from './Quest1map3';
import { Start } from './start';

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
                    target: Start,
                    style: 'location-danger'
                }    
        ]
    });
}