namespace RidderMagnus.Items {
    export function Zwaard() {
        return Item({
            name: 'Zwaard',
            damage: '3',
            equipmentType: StoryScript.EquipmentType.RightHand,
            value: 5
            //requirement: vechten >1
        });
    }
}