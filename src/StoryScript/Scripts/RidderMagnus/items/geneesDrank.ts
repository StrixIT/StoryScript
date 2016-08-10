module RidderMagnus.Items {
    export function GeneesDrank(): IItem {
        return {
            name: 'Geneesdrank',
            equipmentType: StoryScript.EquipmentType.Miscellaneous,
            description: 'Drink dit op als je zwaar gewond bent.',
            use: Actions.Heal('4d2') ,
            price: 5
            //requirement: vechten >0
        }
    }
}