namespace MyNewGame.Items {
    export function Sword(): IItem {
        return {
            name: 'Sword',
            damage: '3',
            equipmentType: StoryScript.EquipmentType.RightHand,
            value: 5
        }
    }
}