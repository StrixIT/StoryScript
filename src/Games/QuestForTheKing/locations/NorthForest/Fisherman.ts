import { SmallBoat } from '../../items/SmallBoat';
import { Location, IGame } from '../../types';
import description from './Fisherman.html';
import { NorthRoad } from './NorthRoad';
import { Honeycastle } from '../Sea/Honeycastle';
import { Mermaid } from '../Sea/Mermaid';

export function Fisherman() {
    return Location({
        name: 'The Fishermans Cottage',
        description: description,
        destinations: [
            {
                name: 'The Northern Road',
                target: NorthRoad
            },
            {
                name: 'The Mermaid',
                target: Mermaid,
                style: 'location-danger'
            },   
            {
                name: 'The Honeycom Castle',
                target: Honeycastle,
                style: 'location-water',
                barrier: {
                    name: 'The blue sea',
                    actions: [[
                        'LookAtCastle',
                            {
                                text: 'Look at the castle',
                                execute(game, barrier, destination) {
                                    game.logToLocationLog('In the distance across the waves, you can see a castle!')
                                },
                            }
                    ]],
                    key: SmallBoat
                }
            }                                 
        ]
    });
}