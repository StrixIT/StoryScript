module QuestForTheKing.Items {
    export function Goldnecklace(): IItem {
        return {
            name: 'Bow',
            damage: '1',
            equipmentType: StoryScript.EquipmentType.Amulet,
            arcane: true,
            value: 5,           
        }
    }
}