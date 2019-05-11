module QuestForTheKing.Items {
    export function Pearl() {
        return Item({
            name: 'Pearl',
            damage: '0',
            equipmentType: StoryScript.EquipmentType.Miscellaneous,
            value: 20,            
        });
    }
}