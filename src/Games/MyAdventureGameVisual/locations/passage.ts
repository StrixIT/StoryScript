namespace MyAdventureGameVisual.Locations {
    export function Passage() {
        return Location({
            name: 'A passage in the undergrowth',
            destinations: [
                {
                    name: 'Back to the fountain',
                    target: Locations.Start
                }
            ],
            features: [
                {
                    name: 'Wounded warrior',
                    combinations: {
                        failText: 'That won\'t help him.',
                        combine: [
                            {
                                combinationType : Constants.LOOKAT,
                                match: (game, target, tool): string => {
                                    var feature = game.currentLocation.features.get('woundedwarrior');

                                    if (feature) {
                                        game.character.items.push(Items.Flask);
                                        game.currentLocation.features.remove(feature);
                                        return `Looking at the warrior, you see a flask on his belt.
                                                carefully, you remove it.`;
                                    }

                                    return null;
                                }
                            }
                        ]
                    },
                },
                Items.Herbs(),
                {
                    name: 'passageback',
                    combinations: {
                        combine: [
                            {
                                combinationType: Constants.WALK,
                                match: (game, target, tool): string => {
                                    game.changeLocation(Locations.Start);
                                    return 'You crawl back through the passage...';
                                }
                            }
                        ]
                    }
                }
            ]
        });
    }
}