namespace MyNewGame.Items {
    export function LeatherBoots() {
        return BuildItem({
            name: 'Leather boots',
            defense: 1,
            equipmentType: StoryScript.EquipmentType.Feet,
            value: 2
        });
    }
}