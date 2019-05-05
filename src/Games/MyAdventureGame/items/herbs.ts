namespace MyAdventureGame.Items {
    export function Herbs() {
        return BuildItem({
            name: 'Herbs',
            equipmentType: StoryScript.EquipmentType.Miscellaneous
        });
    }
}