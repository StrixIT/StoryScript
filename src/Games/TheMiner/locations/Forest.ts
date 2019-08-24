namespace TheMiner.Locations {
    export function Forest() {
        return Location({
            name: 'Forest',
            destinations: [
                {
                    name: 'Back to town',
                    target: Locations.Start
                }
            ],
            enterEvents: [
                (game) => { game.character.items.push(Items.Fruit()); }
            ],
            features: [
                Items.Fruit(),
                        {
                            name: 'animals',
                            combinations: {
                            combine: [
                                        {
                                            combinationType: Constants.LOOKAT,
                                            match: (game, target, tool): string => {
                                                return "If you sit still for a while, you spot squirrels, rabbits and many kinds of birds.";                                            }
                                        },
                                        {
                                            combinationType: Constants.TAKE,
                                            match: (game, target, tool): string => {
                                                return "The animals are too fast for you to catch with your bare hands.";
                                            }
                                        }

                                    ]
                                    }
                                },  
                                {
                                    name: 'trees',
                                    combinations: {
                                    combine: [
                                                {
                                                    combinationType: Constants.LOOKAT,
                                                    match: (game, target, tool): string => {
                                                        return "All kinds of trees grow here.";                                            }
                                                },
                                                {
                                                    combinationType: Constants.TAKE,
                                                    match: (game, target, tool): string => {
                                                        return "They are firmly rooted. This would require a suitable tool.";
                                                        // needs axe combination, use axe on trees
                                                    }
                                                }
        
                                            ]
                                            }
                                        },  

                    ]
        })
    }
}