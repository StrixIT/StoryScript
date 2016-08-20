module QuestForTheKing.Items {
    export function Dagger(): StoryScript.IItem {
        return {
            name: 'Dagger',
            damage: '2',
            equipmentType: StoryScript.EquipmentType.LeftHand
        }
    }
}