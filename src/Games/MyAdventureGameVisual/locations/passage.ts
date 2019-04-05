namespace MyAdventureGameVisual.Locations {
    export function Passage(): StoryScript.ILocation {
        return {
            name: 'A passage in the undergrowth',
            destinations: [
                {
                    name: 'Back to the fountain',
                    target: Locations.Start
                }
            ],
            features: [
                {
                    name: 'woundedwarrior',
                    combinations: {
                        failText: 'That won\'t help him.',
                        combine: [
                            {
                                type: Constants.LOOKAT,
                                match: (game, tool, target): string => {
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
                Items.Herbs,
                {
                    name: 'passage',
                    combinations: {
                        combine: [
                            {
                                type: Constants.WALK,
                                match: (game, tool, target): string => {
                                    game.changeLocation(Locations.Start);
                                    return 'You crawl back through the passage...';
                                }
                            }
                        ]
                    }
                }
            ]
        }
    }
}