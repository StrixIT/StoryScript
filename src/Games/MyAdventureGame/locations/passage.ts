namespace MyAdventureGame.Locations {
    export function Passage() {
        return Location({
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
                    name: 'Wounded warrior',
                    combinations: {
                        failText: 'That won\'t help him.',
                        combine: [
                            {
                                type: Constants.LOOKAT,
                                match: (game, tool, target): string => {
                                    if (!game.character.items.get(Items.Flask)) {
                                        game.character.items.push(Items.Flask);
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
        });
    }
}