namespace MyNewGame.Items {
    export function Sword(): IItem {
        return {
            name: 'Sword',
            description: StoryScript.Constants.HTML,
            damage: '3',
            equipmentType: StoryScript.EquipmentType.RightHand,
            value: 5
        }
    }
}