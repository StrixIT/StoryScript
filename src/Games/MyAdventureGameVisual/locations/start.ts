namespace MyAdventureGameVisual.Locations {
    export function Start(): StoryScript.ILocation {
        return {
            name: 'Start',
            features: [
                {
                    name: 'Fountain',
                    combinations: {
                        combine: [
                            {
                                type: Constants.LOOKAT,
                                match: (game, tool, target): string => {
                                    return 'You look at the fountain water. It is very clear and reflects the forest.';
                                }
                            },
                            {
                                type: Constants.TOUCH,
                                match: (game, tool, target): string => {
                                    if (!game.currentLocation.features.get('passage')) {
                                        game.currentLocation.features.push(Features.Passage);
                                        return `You walk towards the fountain and touch the fountain water.
                                         It is a little cold. When you pull back your hand, you hear a soft
                                         muttering. It is coming from a small passage in the undergrowth.`;
                                    }
                                    else {
                                        return 'The fountain water is pleasant to the touch.';
                                    }
                                }
                            },
                            {
                                type: Constants.USE,
                                tool: Items.Flask,
                                match: (game, tool, target): string => {
                                    var flask = game.character.items.get(Items.Flask);

                                    if (flask) {
                                        game.character.items.remove(flask);
                                        game.character.items.push(Items.Water);
                                        return `You fill the flask with the clear fountain water.`;
                                    }
                                    else {
                                        return 'The fountain water is pleasant to the touch.';
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