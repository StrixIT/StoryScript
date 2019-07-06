namespace MyAdventureGameVisual.Items {
    export function Water(): IItem {
        return Item({
            name: 'Fountain water',
            equipmentType: StoryScript.EquipmentType.Miscellaneous,
            combinations: {
                failText: 'You can\'t use the water like that',
                combine: [
                    {
                        combinationType: Constants.USE,
                        tool: Items.Herbs,
                        match: (game, target, tool): string => {
                            game.character.items.remove(Items.Water);
                            game.character.items.remove(Items.Herbs);
                            game.character.items.push(Items.HealingPotion);
                            return `You cut the herbs into small pieces and add them to the water.
                                    This potion should help to heal wounds.`;
                        }
                    }
                ]
            }
        });
    }
}