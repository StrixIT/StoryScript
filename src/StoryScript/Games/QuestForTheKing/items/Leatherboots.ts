module QuestForTheKing.Items {
    export function Leatherboots(): IItem {
        return {
            name: 'Leather Boots',
            damage: '2',
            equipmentType: StoryScript.EquipmentType.Feet,
            dayAvailable: 1,
            arcane: false,
            value: 5
        }
    }
}