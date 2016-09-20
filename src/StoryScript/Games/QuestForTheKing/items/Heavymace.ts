module QuestForTheKing.Items {
    export function Heavymace(): IItem {
        return {
            name: 'Heavy Mace',
            damage: '2',
            equipmentType: StoryScript.EquipmentType.LeftHand,
            dayAvailable: 3,
            arcane: false,
            value: 25,
            attackText: 'You swing your heavy mace',
            class: Class.Warrior
        }
    }
}