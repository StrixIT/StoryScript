module QuestForTheKing.Items {
    export function DetectMagic(): IItem {
        return {
            name: 'Detect Magic',
            description: StoryScript.Constants.HTML,
            damage: '2',
            equipmentType: StoryScript.EquipmentType.Hands,
            dayAvailable: 1,
            arcane: true,
            value: 7,
            itemClass: Class.Wizard    
        }
    }
}