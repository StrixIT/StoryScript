module QuestForTheKing.Items {
    export function LongSword(): StoryScript.IItem {
        return {
            name: 'Long Sword',
            damage: '2',
            equipmentType: StoryScript.EquipmentType.LeftHand
        }
    }
}