module QuestForTheKing.Items {
    export function LongSword() {
        return Item({
            name: 'Long Sword',
            damage: '1D6',
            equipmentType: StoryScript.EquipmentType.LeftHand,
            value: 5,
            attackText: 'You swing your longsword',
            itemClass: Class.Warrior
        });
    }
}