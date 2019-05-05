namespace DangerousCave.Items {
    export function Sword() {
        return BuildItem({
            name: 'Zwaard',
            damage: '3',
            equipmentType: StoryScript.EquipmentType.RightHand
        });
    }
}