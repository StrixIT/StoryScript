module QuestForTheKing.Items {
    export function Leatherboots(): IItem {
        return {
            name: 'Leather Boots',
            description: StoryScript.Constants.HTML,
            damage: '2',
            equipmentType: StoryScript.EquipmentType.Feet,
            dayAvailable: 1,
            arcane: false,
            value: 5,
            itemClass: [Class.Rogue, Class.Warrior, Class.Wizard]
        }
    }
}