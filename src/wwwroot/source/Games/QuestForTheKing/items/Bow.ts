module QuestForTheKing.Items {
    export function Bow(): IItem {
        return {
            name: 'Bow',
            description: StoryScript.Constants.HTML,
            damage: '1',
            equipmentType: StoryScript.EquipmentType.LeftHand,
            arcane: false,
            value: 3,
            attackText: 'You fire your bow',
            itemClass: [Class.Rogue, Class.Warrior]
        }
    }
}