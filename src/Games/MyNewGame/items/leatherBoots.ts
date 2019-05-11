namespace MyNewGame.Items {
    export function LeatherBoots() {
        return Item({
            name: 'Leather boots',
            defense: 1,
            equipmentType: StoryScript.EquipmentType.Feet,
            value: 2
        });
    }
}