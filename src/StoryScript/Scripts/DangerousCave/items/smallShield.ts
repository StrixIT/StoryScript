module StoryScript.Items {
    export function SmallShield(): Interfaces.IItem {
        return {
            name: 'Klein schild',
            defense: 2,
            equipmentType: EquipmentType.LeftHand
        }
    }
}