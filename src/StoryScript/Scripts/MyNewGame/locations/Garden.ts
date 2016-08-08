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
                        var garden = game.locations.first('Garden');

                        // Add a new destination.
                        garden.destinations.push({
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

                        // Remove the action from the garden.
                        garden.actions.splice(0, 1);
                    }
                },
                {
                    text: 'Look in the pond',
                    execute: (game: IGame) => {
                        var garden = game.locations.first('Garden');

                        game.logToLocationLog(`The pond is shallow. There are frogs
                             and snails in there, but nothing of interest.`);

                        // Remove the action from the garden. Take into account
                        // that the Search action might or might not be there
                        var start = garden.actions.length - 1;
                        garden.actions.splice(start, 1);
                    }
                }
            ]
        }
    }
}