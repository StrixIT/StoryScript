namespace TheMiner.Items {
    export function Fruit() {
        return Item({
            name: 'fruit',
            equipmentType: StoryScript.EquipmentType.Miscellaneous,
            combinations: {
                combine: [
                            {
                                combinationType: Constants.LOOKAT,
                                match: (game, target, tool): string => {
                                    return "You see plenty of edible berries, leaves and mushrooms here.";
                                }
                            },
                            {
                                combinationType: Constants.TAKE,
                                match: (game, target, tool): string => 
                                {
                                    game.character.items.push(Items.Food);
                                    return "You gather some food.";
                                }
                            },
                            {
                                combinationType: Constants.EAT,
                                match: (game, target, tool): string => {
                                    game.character.hitpoints += 5;

                                    var isFeature = game.currentLocation.features.some(f => f === target);

                                    if (!isFeature) {
                                        game.character.items.remove(<IItem>target);
                                    }

                                    return "Yum.";                                            }
                            }
                        ]
            }
        })
    }
}