namespace DangerousCave.Items {
    export function Lantern() {
        return BuildItem({
            name: 'Lantaren',
            bonuses: {
                perception: 1
            },
            equipmentType: StoryScript.EquipmentType.LeftHand
        });
    }
}