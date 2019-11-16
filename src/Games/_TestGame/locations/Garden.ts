import { IGame, Location } from '../interfaces/types';
import { RegisterLocation } from '../../../Engine/Interfaces/storyScript'
import { Start } from './start';
import { BasementKey } from '../items/basementKey';
import { Basement } from './Basement';

export function Garden() {
    return Location({
        name: 'Garden',
        destinations: [
            {
                name: 'Enter your home',
                target: Start,
            }
        ],
        enterEvents: [
            (game) => {
                game.logToActionLog('You see a squirrel running off.');
            }
        ],
        actions: [
            {
                text: 'Search the Shed',
                execute: (game) => {
                    // Add a new destination.
                    game.currentLocation.destinations.push({
                        name: 'Enter the basement',
                        target: Basement,
                        barrier: {
                            key: BasementKey,
                            name: 'Wooden trap door',
                            actions: [
                                {
                                    text: 'Inspect',
                                    execute: (game: IGame) => {
                                        game.logToLocationLog('The trap door looks old but still strong due to steel reinforcements. It is locked.');
                                    }
                                }
                            ]
                        }
                    });
                }
            },
            {
                text: 'Look in the pond',
                execute: (game: IGame) => {
                    game.logToLocationLog(`The pond is shallow. There are frogs
                            and snails in there, but nothing of interest.`);
                }
            }
        ]
    });
}

RegisterLocation(Garden);