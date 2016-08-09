module RidderMagnus.Items {
    export function GoudenRing(): IItem {
        return {
            name: 'Gouden ring',
            damage: '0',
            equipmentType: StoryScript.EquipmentType.Amulet ,
            price: 30
            //requirement: sluipen >0
        }
    }
}