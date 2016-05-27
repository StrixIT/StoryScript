module StoryScript.Items {
    export function Sword(): Interfaces.IItem {
        return {
            name: 'Zwaard',
            damage: '3',
            equipmentType: EquipmentType.RightHand
        }
    }
}