module QuestForTheKing.Items {
    export function Roundshield(): IItem {
        return {
            name: 'Round Shield',
            description: StoryScript.Constants.HTML,
            damage: '2',
            equipmentType: StoryScript.EquipmentType.RightHand,
            dayAvailable: 2,
            arcane: false,
            value: 10,
            itemClass: Class.Warrior
        }
    }
}