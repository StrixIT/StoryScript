import {SmallBoat} from '../../items/SmallBoat';
import {Location} from '../../types';
import description from './Fisherman.html?raw';
import {Beach} from './Beach';
import {Castleapproach} from "../Sea/Castleapproach.ts";
import {Octopus} from "../Sea/Octopus.ts";
import {Fisherman as FisherManPerson} from '../../persons/Fisherman'

export function Fisherman() {
    return Location({
        name: 'The Fishermans Cottage',
        description: description,
        persons: [
            FisherManPerson()
        ],
        destinations: [
            {
                name: 'To the Beach',
                target: Beach
            },
            {
                name: 'The Octopus',
                target: Octopus,
                style: 'location-water'
            },
            {
                name: 'The Honeycomb Castle',
                target: Castleapproach,
                style: 'location-water',
                barriers: [
                    ['BlueSea', {
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
                    }]]
            }
        ]
    });
}