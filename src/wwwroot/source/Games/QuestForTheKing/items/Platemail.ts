module QuestForTheKing.Items {
    export function Platemail(): IItem {
        return {
            name: 'Platemail',
            description: StoryScript.Constants.HTML,
            equipmentType: StoryScript.EquipmentType.Body,
            dayAvailable: 1,
            arcane: false,
            value: 45,
            itemClass: [Class.Warrior]
        }
    }
}