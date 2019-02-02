module QuestForTheKing.Items {
    export function Pearl(): IItem {
        return {
            name: 'Pearl',
            damage: '0',
            equipmentType: StoryScript.EquipmentType.Miscellaneous,
            value: 20,            
        }
    }
}