namespace TheMiner.Locations {
    export function MineEntrance() {
        return Location({
            name: 'Mine Entrance',
            destinations: [
                {
                    name: 'Back to town',
                    target: Locations.Start
                }
            ],
            features: [
                {
                    name: 'RockPile',
                    combinations: {
                    combine: [
                                {
                                    combinationType: Constants.LOOKAT,
                                    match: (game, target, tool): string => {
                                        return "Just needs a pick plus some time and effort. Riches await!";
                                    }
                                },
                                {
                                    combinationType: Constants.USE,
                                    tool: Items.Pick,
                                    match: (game, target, tool): string => {
                                        game.currentLocation.destinations.push({
                                            name: "Into the mine",
                                            target: Locations.Mine

                                        });
                                        return "You hack away at the rocks until your back aches and many hours pass. But eventually you clear the entrance. The mine and its riches await you! ";
                                    }
                                },
                                {
                                    combinationType: Constants.TAKE,
                                    match: (game, target, tool): string => {
                                        return "You pick up some rocks. Heavy. Might be useful to throw at something.";
                                    }
                                }
                            ]
                            }
                        },
                        {
                            name: 'Pick',
                            combinations: {
                            combine: [
                                        {
                                            combinationType: Constants.LOOKAT,
                                            match: (game, target, tool): string => {
                                                return "That's mine. It was cheap, and yet it will make me rich.";
                                            }
                                        },
                                        {
                                            combinationType: Constants.TAKE,
                                            match: (game, target, tool): StoryScript.IMatchResult => {
                                                game.character.items.push(Items.Pick);
                                                return {
                                                    text: "You pick up your pick. Ready for mining!",
                                                    removeTarget: true
                                                };
                                            }
                                        }
                                    ]
                                    }
                                },
                    ]
        });
    }
}