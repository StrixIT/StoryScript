namespace MyAdventureGameVisual.Items {
    export function Herbs(): IItem {
        return Item({
            name: 'Herbs',
            equipmentType: StoryScript.EquipmentType.Miscellaneous,
            picture: 'herbs.png',
            combinations: {
                combine: [
                    {
                        combinationType: Constants.TOUCH,
                        match: (game, target, tool): string => {
                            if (target) {
                                game.character.items.push(<IItem>target);
                                game.currentLocation.features.remove(target);
                                return `You collect the herbs.`;
                            }

                            return null;
                        }
                    }
                ]
            }
        });
    }
}