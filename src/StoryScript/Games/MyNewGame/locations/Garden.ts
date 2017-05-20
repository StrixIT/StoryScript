module MyNewGame.Locations {
    export function Garden(): StoryScript.ILocation {
        return {
            name: 'Garden',
            destinations: [
                {
                    text: 'Enter your home',
                    target: Locations.Start,
                }
            ],
            events: [
                (game) => {
                    game.logToActionLog('You see a squirrel running off.');
                }
            ],
            actions: [
                {
                    text: 'Search the Shed',
                    execute: (game) => {
                        // Add a new destination.
                        // Todo: make sure the destination action function pointer is set correctly when storing the game.
                        game.currentLocation.destinations.push({
                            text: 'Enter the basement',
                            target: Locations.Basement,
                            barrier: {
                                key: Items.BasementKey,
                                text: 'Wooden trap door',
                                actions: [
                                    {
                                        text: 'Inspect',
                                        action: (game: IGame) => {
                                            game.logToLocationLog('The trap door looks old but still strong due to steel reinforcements. It is not locked.');
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
        }
    }
}