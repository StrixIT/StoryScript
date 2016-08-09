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
                (game: IGame) => {
                    game.logToActionLog('You see a squirrel running off.');
                }
            ],
            actions: [
                {
                    text: 'Search the Shed',
                    execute: (game: IGame) => {
                        // Add a new destination.
                        game.currentLocation.destinations.push({
                            text: 'Enter the basement',
                            target: Locations.Basement,
                            barrier: {
                                text: 'Wooden trap door',
                                actions: [
                                    {
                                        text: 'Inspect',
                                        action: () => {
                                        }
                                    },
                                    {
                                        text: 'Open',
                                        action: () => {
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