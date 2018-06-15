namespace AdventureGame.Locations {
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
                        combinations: {                            
                            combine: [
                                {
                                    target: Items.Dagger,
                                    type: Constants.THROW,
                                    match: (game, tool, target) => {
                                        game.logToLocationLog('Threw dagger at fence!');
                                    }
                                }
                            ]
                        }
                    },
                },
                {
                    name: 'To Second',
                    target: Locations.Second
                }
            ],
            features: [
                {
                    name: 'Vine',
                    combinations: {
                        combineFailText: (game, tool, target) => {
                            return 'Cannot use vine in this way!';
                        },
                        combine: [
                            {
                                target: Items.Dagger,
                                type: Constants.USE,
                                match: (game, tool, target) => {
                                    game.logToLocationLog('Used dagger on vine!');
                                }
                            }
                        ]
                    }
                }
            ],
            persons: [
                Persons.Friend
            ],
            enemies: [
                //Enemies.Goblin
            ]
        }
    }
}