module QuestForTheKing.Items {
    export function Warhammer(): IItem {
        return {
            name: 'Warhammer',
            damage: '2',
            equipmentType: StoryScript.EquipmentType.LeftHand,
            value: 5,
            attackText: 'You swing your warhammer',
            class: Class.Warrior
        }
    }
}