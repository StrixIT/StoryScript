module QuestForTheKing.Items {
    export function Battleaxe(): IItem {
        return {
            name: 'Battle Axe',
            description: StoryScript.Constants.HTML,
            damage: '1D8',
            equipmentType: StoryScript.EquipmentType.LeftHand,
            value: 5,
            attackText: 'You swing your battle axe',
            itemClass: Class.Warrior
        }
    }
}