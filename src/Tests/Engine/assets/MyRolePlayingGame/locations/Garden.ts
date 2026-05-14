import {IGame, Location} from '../types';
import {Start} from './start';
import {BasementKey} from '../items/basementKey';
import {Basement} from './Basement';
import description from './Garden.html?raw';

export function Garden() {
    return Location({
        name: 'Garden',
        description: description,
        destinations: [
            {
                name: 'Enter your home',
                target: Start,
            }
        ],
        enterEvents:
            [[
                'Squirrel',
                (game) => {
                    game.logToActionLog('You see a squirrel running off.');
                }
            ]],
        actions:
            [[
                'SearchShed',
                {
                    text: 'Search the Shed',
                    execute: (game: IGame) => {
                        // Add a new destination.
                        game.currentLocation.destinations.add({
                            name: 'Enter the basement',
                            target: Basement,
                            barriers: [
                                ['TrapDoor', {
                                    key: BasementKey,
                                    name: 'Wooden trap door',
                                    actions: [[
                                        'Inspect',
                                        {
                                            text: 'Inspect',
                                            execute: (game: IGame) => {
                                                game.logToLocationLog('The trap door looks old but still strong due to steel reinforcements. It is locked.');
                                            }
                                        }
                                    ]]
                                }]]
                        });
                    }
                }],
                [
                    'LookInPond',
                    {
                        text: 'Look in the pond',
                        execute: (game: IGame) => {
                            game.logToLocationLog(`The pond is shallow. There are frogs and snails in there, but nothing of interest.`);
                        }
                    }]
            ]
    });
}