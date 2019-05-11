module QuestForTheKing.Items {
    export function Roundshield() {
        return Item({
            name: 'Round Shield',
            damage: '2',
            equipmentType: StoryScript.EquipmentType.RightHand,
            dayAvailable: 2,
            arcane: false,
            value: 10,
            itemClass: Class.Warrior
        });
    }
}