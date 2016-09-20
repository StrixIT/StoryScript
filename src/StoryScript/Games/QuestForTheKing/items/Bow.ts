module QuestForTheKing.Items {
    export function Bow(): IItem {
        return {
            name: 'Bow',
            damage: '1',
            equipmentType: StoryScript.EquipmentType.LeftHand,
            arcane: false,
            value: 3,
            attackText: 'You fire your bow',
            class: Class.Warrior    
        }
    }
}