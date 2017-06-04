module AdventureGame.Locations {
    export function Start(): StoryScript.ILocation {
        return {
            name: 'Start',
            items: [
                Items.Dagger
            ],
            destinations: [
                {
                    name: 'To junction',
                    target: Locations.Junction,
                    barrier: {
                        name: 'Fence',
                        combinations: [
                            {
                                target: Items.Dagger,
                                type: Constants.THROW,
                                combine: (game) => {
                                    game.logToLocationLog('Threw dagger at fence!');
                                }
                            }
                        ]
                    }
                }
            ]
        }
    }
}