module QuestForTheKing.Items {
    export function Boat(): IItem {
        return {
            name: 'Small Boat',
            description: StoryScript.Constants.HTML,
            damage: '0',
            equipmentType: StoryScript.EquipmentType.Miscellaneous,
            value: 10,            
        }
    }
}