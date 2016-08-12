module MyNewGame.Items {
    export function LeatherBoots(): IItem {
        return {
            name: 'Leather boots',
            defense: 1,
            equipmentType: StoryScript.EquipmentType.Feet,
            value: 2
        }
    }
}