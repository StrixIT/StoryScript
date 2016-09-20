module QuestForTheKing.Items {
    export function Roundshield(): IItem {
        return {
            name: 'Round Shield',
            damage: '2',
            equipmentType: StoryScript.EquipmentType.RightHand,
            dayAvailable: 2,
            arcane: false,
            value: 10,
            class: Class.Warrior
        }
    }
}