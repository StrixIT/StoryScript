module QuestForTheKing.Items {
    export function Magicflower() {
        return BuildItem({
            name: 'Magic Flower',
            damage: '0',
            equipmentType: StoryScript.EquipmentType.Miscellaneous,
            value: 0
        });
    }
}