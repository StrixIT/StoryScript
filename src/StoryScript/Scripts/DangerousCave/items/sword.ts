module DangerousCave.Items {
    export function Sword(): StoryScript.IItem {
        return {
            name: 'Zwaard',
            damage: '3',
            equipmentType: StoryScript.EquipmentType.RightHand
        }
    }
}