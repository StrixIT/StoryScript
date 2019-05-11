module QuestForTheKing.Items {
    export function Boat() {
        return Item({
            name: 'Small Boat',
            damage: '0',
            equipmentType: StoryScript.EquipmentType.Miscellaneous,
            value: 10,            
        });
    }
}