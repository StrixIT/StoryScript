module QuestForTheKing.Items {
    export function Leatherarmor(): IItem {
        return {
            name: 'Leather Armor',
            damage: '2',
            equipmentType: StoryScript.EquipmentType.Body,
            dayAvailable: 1,
        }
    }
}