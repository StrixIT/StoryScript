module StoryScript.Items {
    export function Lantern(): Interfaces.IItem {
        return {
            name: 'Lantaren',
            bonuses: {
                perception: 1
            },
            equipmentType: EquipmentType.LeftHand
        }
    }
}