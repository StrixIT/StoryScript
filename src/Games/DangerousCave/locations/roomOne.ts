import { IGame, Location } from '../types';
import description from './roomOne.html'
import { Open, IDestination, IBarrier } from 'storyScript/Interfaces/storyScript';
import { Orc } from '../enemies/orc';
import { BlackKey } from '../items/blackKey';
import { Inspect } from '../actions/inspect';
import { RightCorridor } from './rightCorridor';
import { CentreRoom } from './centreRoom';
import { LeftRoom } from './leftRoom';
import { LeftCorridor } from './leftCorridor';

export function RoomOne() {
    return Location({
        name: 'De kamer van de ork',
        description: description,
        enemies: [
            Orc()
        ],
        items: [
            BlackKey()
        ],
        destinations: [
            {
                name: 'Noord',
                target: RightCorridor,
                barrier: {
                    name: 'Houten deur',
                    actions: [
                        {
                            text: 'Onderzoek de deur',
                            execute: Inspect('Een eikenhouten deur met een ijzeren hendel. De deur is niet op slot.')
                        },
                        {
                            text: 'Open de deur',
                            execute: Open((game: IGame, barrier: IBarrier, destination: IDestination) => {
                                game.logToLocationLog('Je opent de eikenhouten deur.');
                                destination.name = 'Gang (noord)';
                            })
                        }
                    ]
                }
            },
            {
                name: 'Tweede deur (west)',
                target: CentreRoom,
            },
            {
                name: 'Derde deur (zuid)',
                target: LeftRoom
            },
            {
                name: 'Deuropening (oost); richting ingang',
                target: LeftCorridor
            }
        ]
    });
}