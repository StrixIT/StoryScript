namespace DangerousCave.Items {
    export function Lantern() {
        return Item({
            name: 'Lantaren',
            bonuses: {
                perception: 1
            },
            equipmentType: StoryScript.EquipmentType.LeftHand
        });
    }
}