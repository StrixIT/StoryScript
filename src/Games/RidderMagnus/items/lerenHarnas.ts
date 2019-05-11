namespace RidderMagnus.Items {
    export function LerenHarnas() {
        return BuildItem({
            name: 'Leren harnas',
            defense: 2 ,
            equipmentType: StoryScript.EquipmentType.Body,
            value: 10
            //requirement: vechten >2
        });
    }
}