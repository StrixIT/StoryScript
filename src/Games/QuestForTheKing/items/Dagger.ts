module QuestForTheKing.Items {
    export function Dagger(): IItem {
        return {
            name: 'Dagger',
            description: StoryScript.Constants.HTML,
            damage: '2',
            equipmentType: StoryScript.EquipmentType.LeftHand,           
            value: 5,
            attackText: 'You thrust your dagger',
            itemClass: [Class.Rogue, Class.Warrior]       
        }
    }
}