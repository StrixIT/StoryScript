namespace RidderMagnus.Items {
    export function GeneesDrank() {
        return Item({
            name: 'Geneesdrank',
            equipmentType: StoryScript.EquipmentType.Miscellaneous,
            description: 'Drink dit op als je zwaar gewond bent.',
            use: Actions.Heal('4d2'),
            charges: 1 ,
            value: 5
            //requirement: vechten >0
        });
    }
}