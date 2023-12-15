﻿import { Location, IGame } from '../types';
import description from './BrennusApproach.html';
import { Quest1map1 } from './ForestOfMyrr/Quest1map1';
import { Brennus } from '../enemies/Brennus';

export function BrennusApproach() {
    return Location({
        name: 'Brennus',
        description: description,
        destinations: [
            {
                name: 'Back to the Map',
                target: Quest1map1
            }
        ],
        enemies: [
            Brennus()
        ]
    });
}