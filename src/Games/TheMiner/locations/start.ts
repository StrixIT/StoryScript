namespace TheMiner.Locations {
    export function Start() {
        return Location({
            name: 'Start',
            destinations: [
                {
                    name: 'To the mine',
                    target: Locations.MineEntrance
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
                                        return "You pick up some bricks. Heavy. Might be useful to throw at something.";
                                    }
                                }
                            ]
                            }
                        },
                        

                    ]
        });
    }
}