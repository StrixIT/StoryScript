module QuestForTheKing.Items {
    export function Beesting(): IItem {
        return {
            name: 'Beesting',
            damage: '4',
            equipmentType: StoryScript.EquipmentType.LeftHand,
            value: 20,       
            itemClass: Class.Warrior     
        }
    }
}