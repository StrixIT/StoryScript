module RidderMagnus.Items {
    export function GeneesDrank(): IItem {
        return {
            name: 'Geneesdrank',
            equipmentType: StoryScript.EquipmentType.Miscellaneous,
            use: Actions.Heal('1d8') ,
            price: 5
            //requirement: vechten >0
        }
    }
}