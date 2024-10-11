import {SmallBoat} from '../../items/SmallBoat';
import {IGame, Location} from '../../types';
import description from './Fisherman.html?raw';
import {Beach} from './Beach';
import {Castleapproach} from "../Sea/Castleapproach.ts";
import {Octopus} from "../Sea/Octopus.ts";
import {Fisherman as FisherManPerson} from '../../persons/Fisherman'
import {ActionType} from "storyScript/Interfaces/enumerations/actionType.ts";
import {ActionStatus} from "storyScript/Interfaces/enumerations/actionStatus.ts";

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
        ],
        actions: [[
            'RentBoat', {
                text: 'Rent the small boat',
                actionType: ActionType.Regular,
                execute: (game: IGame) => {
                    game.party.currency -= 20;
                    game.logToLocationLog('You rent the boat for 20 gold coins.');
                },
                status: (game: IGame) => {
                    return game.party.currency >= 20 ? ActionStatus.Available : ActionStatus.Disabled;
                }
            }
        ]]
    });
}