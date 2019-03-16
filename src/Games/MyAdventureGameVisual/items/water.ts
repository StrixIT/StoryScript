namespace MyAdventureGameVisual.Items {
    export function Water(): IItem {
        return {
            name: 'Fountain water',
            equipmentType: StoryScript.EquipmentType.Miscellaneous,
            combinations: {
                failText: 'You can\'t use the water like that',
                combine: [
                    {
                        type: Constants.USE,
                        tool: Items.Herbs,
                        match: (game, tool, target): string => {
                            game.character.items.remove(Items.Water);
                            game.character.items.remove(Items.Herbs);
                            game.character.items.push(Items.HealingPotion);
                            return `You cut the herbs into small pieces and add them to the water.
                                    This potion should help to heal wounds.`;
                        }
                    }
                ]
            }
        }
    }
}