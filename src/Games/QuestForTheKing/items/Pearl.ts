module QuestForTheKing.Items {
    export function Pearl() {
        return BuildItem({
            name: 'Pearl',
            damage: '0',
            equipmentType: StoryScript.EquipmentType.Miscellaneous,
            value: 20,            
        });
    }
}