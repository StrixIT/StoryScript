module QuestForTheKing.Items {
    export function Chainmail(): StoryScript.IItem {
        return {
            name: 'Chain Mail',
            damage: '2',
            equipmentType: StoryScript.EquipmentType.Body
        }
    }
}