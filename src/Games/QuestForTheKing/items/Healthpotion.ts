module QuestForTheKing.Items {
    export function Healthpotion() {
        return Item({
            name: 'Health Potion',
            damage: '2',
            equipmentType: StoryScript.EquipmentType.Miscellaneous,
            dayAvailable: 1,
            arcane: true,
            value: 5,
            useInCombat: true,
            itemClass: [Class.Rogue, Class.Warrior, Class.Wizard],
            use: (game, item) => {
                game.character.currentHitpoints += 5;
                game.character.items.remove(item);
            }
        });
    }
}