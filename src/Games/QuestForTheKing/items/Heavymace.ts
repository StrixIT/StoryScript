module QuestForTheKing.Items {
    export function Heavymace() {
        return Item({
            name: 'Heavy Mace',
            damage: '2',
            equipmentType: [StoryScript.EquipmentType.LeftHand, StoryScript.EquipmentType.RightHand],
            dayAvailable: 3,
            arcane: false,
            value: 25,
            attackText: 'You swing your heavy mace',
            itemClass: Class.Warrior
        });
    }
}