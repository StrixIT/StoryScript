namespace AdventureGame.Locations {
    export function Start(): StoryScript.ILocation {
        return {
            name: 'Start',
            enterEvents: [
                (game) => {
                    game.character.items.push(Items.Flask);
                }
            ],
            features: [
                {
                    name: 'Vine',
                    combinations: {
                        failText: (game, tool, target) => {
                            return 'Cannot use vine in this way!';
                        },
                        combine: [
                            {
                                target: Items.Dagger,
                                type: Constants.USE,
                                match: (game, tool, target): string => {
                                    return 'Used dagger on vine!';
                                }
                            }
                        ]
                    }
                },
                {
                    name: 'smallbird'
                },
                {
                    name: 'bluebird',
                    combinations: {
                        failText: (game, tool, target) => {
                            return 'That won\'t work';
                        },
                        combine: [
                            {
                                type: Constants.TOUCH,
                                match: (game, tool, target): string => {
                                    game.currentLocation.features.remove('bluebird');
                                    return 'You reach out to the bird, but it flies away!';
                                }
                            },
                            {
                                type: Constants.LOOKAT,
                                match: (game, tool, target): string => {
                                    return 'That is a beautiful little bird.';
                                }
                            }
                        ]
                    }
                },
                {
                    name: 'fox'
                },
                {
                    name: 'fountain',
                    combinations: {
                        failText: (game, tool, target) => {
                            return 'You can\'t use the fountain in this way';
                        },
                        combine: [
                            {
                                type: Constants.TOUCH,
                                match: (game, tool, target): string => {
                                    return 'You touch the fountain water. It is a little cold.';
                                }
                            },
                            {
                                type: Constants.LOOKAT,
                                match: (game, tool, target): string => {
                                    return 'You look at the fountain water. It is very clear and reflects the forest.';
                                }
                            },
                            {
                                type: Constants.USE,
                                tool: Items.Flask,
                                match: (game, tool, target): string => {
                                    game.character.items.remove(Items.Flask);
                                    game.character.items.push(Items.BlessedWater);
                                    return 'You fill the flask with water from the fountain.';
                                }
                            },
                        ]
                    }
                },
                {
                    name: 'owls'
                },
                {
                    name: 'passage',
                    combinations: {
                        combine: [
                            {
                                type: Constants.WALK,
                                match: (game, tool, target): string => {
                                    game.changeLocation(Locations.Second);
                                    return 'You find a passage behind the fountain. You walk through it.'
                                }
                            }
                        ]
                    }
                }
            ]
        }
    }
}