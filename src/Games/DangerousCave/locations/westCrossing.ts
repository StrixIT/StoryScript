import { IGame, Location } from '../types';
import description from './westCrossing.html'
import { Open } from 'storyScript/Interfaces/storyScript';
import { Inspect } from '../actions/inspect';
import { BlackKey } from '../items/blackKey';
import { Goblin } from '../enemies/goblin';
import { CrossRoads } from './crossRoads';
import { Arena } from './arena';

export function WestCrossing() {
    return Location({
        name: 'Een donkere gemetselde gang',
        description: description,
        enemies: [
            Goblin()
        ],
        destinations: [
            {
                name: 'Richting kruispunt (oost)',
                target: CrossRoads
            },
            {
                name: 'Deur (west)',
                target: Arena,
                barrier: {
                    name: 'Metalen deur',
                    key: BlackKey,
                    actions: [
                        {
                            text: 'Onderzoek de deur',
                            execute: Inspect('Een deur van een dof grijs metaal, met een rode deurknop. Op de deur staat een grote afbeelding: een rood zwaard. Zodra je het handvat aanraakt, gloeit het zwaard op met een rood licht. De deur is niet op slot.')
                        },
                        {
                            text: 'Open de deur',
                            execute: Open(function (game, destination) {
                                game.logToLocationLog('Je opent de deur.');
                                destination.name = 'Donkere kamer';
                            })
                        }
                    ]
                }
            }
        ]
    });
}