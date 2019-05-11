module QuestForTheKing.Items {
    export function Magicring() {
        return Item({
            name: 'Magic Ring',
            damage: '0',
            equipmentType: StoryScript.EquipmentType.LeftRing,
            value: 5,            
            itemClass: Class.Wizard
        });
    }
}