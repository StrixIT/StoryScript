namespace TheMiner.Items {
    export function Food() {
        return Item({
            name: 'food',
            equipmentType: StoryScript.EquipmentType.Miscellaneous,
            description: 'can\'t live without it!',
            //StoryScript.IAction.
            combinations: {
                combine: [
                    {
                        combinationType: Constants.EAT,
                        match: (game, target, tool): StoryScript.IMatchResult => {
                            game.character.hitpoints += 5;
                            return { text: "Yum.", removeTarget: true };                                            }
                    },
                ]
            }
        });
    }
}