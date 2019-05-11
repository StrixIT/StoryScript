module QuestForTheKing.Items {
    export function Boat() {
        return BuildItem({
            name: 'Small Boat',
            damage: '0',
            equipmentType: StoryScript.EquipmentType.Miscellaneous,
            value: 10,            
        });
    }
}