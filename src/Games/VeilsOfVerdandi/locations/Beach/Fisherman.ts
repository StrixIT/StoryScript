import {SmallBoat} from '../../items/SmallBoat';
import {IGame, Location} from '../../types';
import description from './Fisherman.html?raw';
import {Beach} from './Beach';
import {Octopus} from "../Sea/Octopus.ts";
import {Fisherman as FisherManPerson} from '../../persons/Fisherman'
import {ActionType} from "storyScript/Interfaces/enumerations/actionType.ts";
import {ActionStatus} from "storyScript/Interfaces/enumerations/actionStatus.ts";
import {IBarrier} from "storyScript/Interfaces/barrier.ts";
import {IBarrierAction} from "storyScript/Interfaces/barrierAction.ts";
import {equals} from "storyScript/utilityFunctions.ts";
import {IslandMeadow} from "../Sea/IslandMeadow.ts";
import {haveItem} from "../../sharedFunctions.ts";

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
                    'LookAcrossTheOcean',
                    {
                        text: 'Look across the ocean',
                        execute(game, barrier, destination) {
                            game.logToLocationLog('The sea seems to stretch on forever...');
                        },
                    }
                ])
            },
            {
                name: 'The distant Island',
                target: IslandMeadow,
                style: 'location-water',
                barriers: getSeaBarrier([
                    'LookAtTheIsland',
                    {
                        text: 'Look at the distant island',
                        execute(game, barrier, destination) {
                            game.logToLocationLog('In the distance across the waves, you can see an island!');
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
                },
                status: (game: IGame) => {
                    if (game.worldProperties.isNight) {
                        return ActionStatus.Unavailable;
                    } else if (haveItem(game, SmallBoat)) {
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
                    game.logToLocationLog('You return the small boat. "Not too bad, here\'s your refund." The fisherman hands you 10 gold coins.' +
                        '"You\'ve proven worthy of my trust. If you ever need it again, you can use my boat for free."');
                    return true;
                },
                status: (game: IGame) => {
                    if (!game.locations.get(IslandMeadow).hasVisited && !game.locations.get(Octopus).hasVisited) {
                        return ActionStatus.Unavailable;
                    } else if (haveItem(game, SmallBoat)) {
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