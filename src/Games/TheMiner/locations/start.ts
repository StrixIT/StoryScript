namespace TheMiner.Locations {
    export function Start() {
        return Location({
            name: 'Start',
            destinations: [
                {
                    name: 'To the mine',
                    target: Locations.MineEntrance
                },
                {
                    name: 'Into the woods',
                    target: Locations.Forest
                }
            ],
            features: [
                {
                    name: 'Bricks',
                    combinations: {
                    combine: [
                                {
                                    combinationType: Constants.LOOKAT,
                                    match: (game, target, tool): string => {
                                        return "You study the bricks. Many are still quite solid. With the right tools you could repair one of these huts easily.";
                                    }
                                },
                                {
                                    combinationType: Constants.TAKE,
                                    match: (game, target, tool): string => {
                                        return "You pick up some bricks. Heavy. With enough of tehse I could repair some walls.";
                                    }
                                }
                            ]
                            }
                        },
                        {
                            name: 'Huts',
                            combinations: {
                            combine: [
                                        {
                                            combinationType: Constants.LOOKAT,
                                            match: (game, target, tool): string => {
                                                return "It would be wise to pick the least ruined of these and repair the walls and roof. I'd have a house to live in!";
                                            // add a quest here, to repair a house. Will need axe, wood, bricks, rope +knife or nails + hammer
                                            }
                                        }

                                    ]
                                    }
                                },  

                    ]
        });
    }
}