﻿import { Location, IGame } from '../../types';
import description from './Quest1map2.html';
import { Magicflowers } from '../Magicflowers';
import { Fisherman } from '../Fisherman';
import { ForestPond } from '../ForestPond';
import { Honeycastle } from '../Honeycombcastle/Honeycastle';
import { Octopus } from '../Octopus';
import { Start } from './start';
import { Quest1map3 } from './Quest1map3';
import { Mermaid } from '../Mermaid';

export function Quest1map2() {
    return Location({
        name: 'The Northern Forest',
        description: description,
        destinations: [
            {
                name: 'Go to the Magic Flower',
                target: Magicflowers
            },
            {
                name: 'Go to the Fishermans Cottage',
                target: Fisherman
            },
            {
                name: 'Go to the Mermaid',
                target: Mermaid
            },       
            {
                name: 'Go to the Forest Pond',
                target: ForestPond
            },  
            {
                name: 'Go to the Honeycom Castle',
                target: Honeycastle
            },      
            {
                name: 'Go to the Octopus',
                target: Octopus
            },
            {
                name: 'Go to the Western Forest',
                target: Start,
                style: 'location-danger'
            },
                {
                name: 'Go to the Eastern Forest',
                target: Quest1map3,
                style: 'location-danger'
            }      
        ]
    });
}