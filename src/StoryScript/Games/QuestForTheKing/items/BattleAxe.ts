module QuestForTheKing.Items {
    export function Battleaxe(): IItem {
        return {
            name: 'Battle Axe',
            damage: '2',
            equipmentType: StoryScript.EquipmentType.LeftHand,
            value: 5,
            attackText: 'You swing your battle axe',
            itemClass: Class.Warrior
        }
    }
}