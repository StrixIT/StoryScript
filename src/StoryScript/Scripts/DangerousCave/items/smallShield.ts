module DangerousCave.Items {
    export function SmallShield(): IItem {
        return {
            name: 'Klein schild',
            defense: 2,
            equipmentType: StoryScript.EquipmentType.LeftHand
        }
    }
}