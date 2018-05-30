module QuestForTheKing.Items {
    export function Chainmail():IItem {
        return {
            name: 'Chain Mail',
            description: StoryScript.Constants.HTML,
            damage: '2',
            equipmentType: StoryScript.EquipmentType.Body,
            dayAvailable: 2,
            arcane: false,
            value: 20,
            itemClass: Class.Warrior
        }
    }
}