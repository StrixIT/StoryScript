module QuestForTheKing.Items {
    export function Boat(): IItem {
        return {
            name: 'Small Boat',
            damage: '0',
            equipmentType: StoryScript.EquipmentType.Miscellaneous,
            value: 10,            
        }
    }
}