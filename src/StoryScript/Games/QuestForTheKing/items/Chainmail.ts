module QuestForTheKing.Items {
    export function Chainmail():IItem {
        return {
            name: 'Chain Mail',
            damage: '2',
            equipmentType: StoryScript.EquipmentType.Body,
            dayAvailable: 2,
            arcane: false,
            value: 20,
            class: Class.Warrior
        }
    }
}