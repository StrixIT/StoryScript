namespace DangerousCave.Items {
    export function SmallShield() {
        return BuildItem({
            name: 'Klein schild',
            defense: 2,
            equipmentType: StoryScript.EquipmentType.LeftHand
        });
    }
}