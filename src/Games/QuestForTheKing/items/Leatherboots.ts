module QuestForTheKing.Items {
    export function Leatherboots() {
        return Item({
            name: 'Leather Boots',
            damage: '2',
            equipmentType: StoryScript.EquipmentType.Feet,
            dayAvailable: 1,
            arcane: false,
            value: 5,
            itemClass: [Class.Rogue, Class.Warrior, Class.Wizard]
        });
    }
}