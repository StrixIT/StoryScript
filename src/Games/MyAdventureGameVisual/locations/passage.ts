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
            items: [
                Items.Herbs
            ],
            features: [
                {
                    name: 'woundedwarrior',
                    picture: 'healingpotion.png',
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
                                    else {
                                        return 'You see nothing else that might help.';
                                    }
                                }
                            }
                        ]
                    }
                }
            ]
        }
    }
}