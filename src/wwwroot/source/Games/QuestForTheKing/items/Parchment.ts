module QuestForTheKing.Items {
    export function Parchment(): IItem {
        return {
            name: 'Old Parchment',
            description: StoryScript.Constants.HTML,
            damage: '0',
            equipmentType: StoryScript.EquipmentType.Miscellaneous                      
        }
    }
}