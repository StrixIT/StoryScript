import {SmallBoat} from '../../items/SmallBoat';
import {IGame, Location} from '../../types';
import description from './Fisherman.html?raw';
import {Beach} from './Beach';
import {Castleapproach} from "../Sea/Castleapproach.ts";
import {Octopus} from "../Sea/Octopus.ts";
import {Fisherman as FisherManPerson} from '../../persons/Fisherman'
import {ActionType} from "storyScript/Interfaces/enumerations/actionType.ts";
import {ActionStatus} from "storyScript/Interfaces/enumerations/actionStatus.ts";
import {IBarrier} from "storyScript/Interfaces/barrier.ts";
import {IBarrierAction} from "storyScript/Interfaces/barrierAction.ts";
import {equals} from "storyScript/utilityFunctions.ts";

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
                style: 'location-water',
                barriers: getSeaBarrier([
                    'LookAtCastle',
                    {
                        text: 'Look at the castle',
                        execute(game, barrier, destination) {
                            game.logToLocationLog('In the distance across the waves, you can see a castle!')
                        },
                    }
                ])
            },
            {
                name: 'The Honeycomb Castle',
                target: Castleapproach,
                style: 'location-water',
                barriers: getSeaBarrier([
                    'LookAcrossTheOcean',
                    {
                        text: 'Look across the ocean',
                        execute(game, barrier, destination) {
                            game.logToLocationLog('The sea seems to stretch on forever...')
                        },
                    }
                ])
            }
        ],
        actions: [[
            'RentBoat', {
                text: 'Rent the small boat',
                actionType: ActionType.Regular,
                execute: (game: IGame) => {
                    game.activeCharacter.items.add(SmallBoat);
                    game.party.currency -= 20;
                    game.logToLocationLog('You rent the boat for 20 gold coins.');
                    return true;
                },
                status: (game: IGame) => {
                    if (game.party.characters.find(c => c.items.find(i => equals(i, SmallBoat)))) {
                        return ActionStatus.Unavailable;
                    } else if (game.party.currency < 20) {
                        return ActionStatus.Disabled;
                    }

                    return ActionStatus.Available;
                },
                confirmationText: 'So you want to rent my boat? Be sure to bring it back in one piece!'
            }
        ],
            [
                'ReturnBoat', {
                text: 'Return the small boat',
                actionType: ActionType.Regular,
                execute: (game: IGame) => {
                    game.activeCharacter.items.delete(SmallBoat);
                    game.party.currency += 10;
                    game.logToLocationLog('You return the small boat. "Not too bad, here\'s your refund." The fisherman hands you 10 gold coins.');
                    return true;
                },
                status: (game: IGame) => {
                    if (game.party.characters.find(c => c.items.find(i => equals(i, SmallBoat)))) {
                        return ActionStatus.Available;
                    }

                    return ActionStatus.Unavailable;
                },
                confirmationText: 'So you\'re ready to return my boat? Let me see how it is doing!'
            }
            ]
        ]
    });
}

function getSeaBarrier(action: [string, IBarrierAction]): [string, IBarrier][] {
    return [['BlueSea', <IBarrier>{
        name: 'The blue sea',
        actions: [action],
        key: SmallBoat
    }]]
}