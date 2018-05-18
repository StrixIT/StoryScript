module QuestForTheKing.Items {
    export function Heavymace(): IItem {
        return {
            name: 'Heavy Mace',
            description: StoryScript.Constants.HTML,
            damage: '2',
            equipmentType: [StoryScript.EquipmentType.LeftHand, StoryScript.EquipmentType.RightHand],
            dayAvailable: 3,
            arcane: false,
            value: 25,
            attackText: 'You swing your heavy mace',
            itemClass: Class.Warrior
        }
    }
}