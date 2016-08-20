module QuestForTheKing.Items {
    export function Rapier(): StoryScript.IItem {
        return {
            name: 'Rapier',
            damage: '2',
            equipmentType: StoryScript.EquipmentType.LeftHand
        }
    }
}