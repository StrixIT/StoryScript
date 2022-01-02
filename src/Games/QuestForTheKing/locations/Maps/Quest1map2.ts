import { Location, IGame } from '../../types';
import description from './Quest1map2.html';
import { Magicflowers } from '../Magicflower/Magicflowers';
import { Fisherman } from '../Fisherman/Fisherman';
import { ForestPond } from '../Forestpond/ForestPond';
import { Honeycastle } from '../Honeycombcastle/Honeycastle';
import { Octopus } from '../Octopus/Octopus';
import { Quest1map1 } from './Quest1map1';
import { Quest1map3 } from './Quest1map3';
import { Mermaid } from '../Mermaid/Mermaid';

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
                target: Quest1map1,
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