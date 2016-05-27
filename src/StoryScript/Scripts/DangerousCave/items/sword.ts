module StoryScript.Items {
    export function Sword(): IItem {
        return {
            name: 'Zwaard',
            damage: '3',
            equipmentType: EquipmentType.RightHand
        }
    }
}