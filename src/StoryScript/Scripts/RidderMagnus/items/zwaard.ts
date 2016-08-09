module RidderMagnus.Items {
    export function Zwaard(): IItem {
        return {
            name: 'Zwaard',
            damage: '3',
            equipmentType: StoryScript.EquipmentType.RightHand,
            price: 5
            //requirement: vechten >1
        }
    }
}