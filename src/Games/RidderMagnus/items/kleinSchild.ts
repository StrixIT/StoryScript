namespace RidderMagnus.Items {
    export function KleinSchild() {
        return BuildItem({
            name: 'Klein schild',
            defense: 1 ,
            equipmentType: StoryScript.EquipmentType.LeftHand ,
            value: 4
            //requirement: vechten >1
        });
    }
}