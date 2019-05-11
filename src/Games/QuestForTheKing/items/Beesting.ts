module QuestForTheKing.Items {
    export function Beesting() {
        return BuildItem({
            name: 'Beesting',
            damage: '1D10',
            equipmentType: StoryScript.EquipmentType.LeftHand,
            value: 20,       
            itemClass: Class.Warrior     
        });
    }
}