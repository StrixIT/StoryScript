import { Location, IGame } from '../../types';
import description from './ForestPond.html';
import { Magicflowers } from '../Magicflower/Magicflowers';
import { Fisherman } from '../Fisherman/Fisherman';
import { ForestPond } from '../Forestpond/ForestPond';
import { Honeycastle } from '../Honeycombcastle/Honeycastle';

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
                target: MermaidDay
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