namespace DangerousCave.Items {
    export function Lantern(): StoryScript.IItem {
        return {
            name: 'Lantaren',
            bonuses: {
                perception: 1
            },
            equipmentType: StoryScript.EquipmentType.LeftHand
        }
    }
}