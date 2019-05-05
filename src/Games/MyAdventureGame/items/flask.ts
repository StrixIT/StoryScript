namespace MyAdventureGame.Items {
    export function Flask() {
        return BuildItem({
            name: 'Flask',
            equipmentType: StoryScript.EquipmentType.Miscellaneous
        });
    }
}