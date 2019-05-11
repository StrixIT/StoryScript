module QuestForTheKing.Items {
    export function Dagger() {
        return Item({
            name: 'Dagger',
            damage: '2',
            equipmentType: StoryScript.EquipmentType.LeftHand,           
            value: 5,
            attackText: 'You thrust your dagger',
            itemClass: [Class.Rogue, Class.Warrior]       
        });
    }
}