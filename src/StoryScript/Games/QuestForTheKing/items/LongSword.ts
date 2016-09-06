module QuestForTheKing.Items {
    export function LongSword(): IItem {
        return {
            name: 'Long Sword',
            damage: '2',
            equipmentType: StoryScript.EquipmentType.LeftHand,
            value: 5,
            attackText: 'You swing your long sword'
        }
    }
}