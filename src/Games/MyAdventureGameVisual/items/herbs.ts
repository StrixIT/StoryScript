namespace MyAdventureGameVisual.Items {
    export function Herbs(): IItem {
        return BuildItem({
            name: 'Herbs',
            equipmentType: StoryScript.EquipmentType.Miscellaneous,
            picture: 'herbs.png',
            combinations: {
                combine: [
                    {
                        type: Constants.TOUCH,
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