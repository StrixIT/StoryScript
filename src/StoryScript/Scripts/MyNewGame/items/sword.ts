module MyNewGame.Items {
    export function Sword(): StoryScript.IItem {
        return {
            name: 'Sword',
            damage: '3',
            equipmentType: StoryScript.EquipmentType.RightHand
        }
    }
}