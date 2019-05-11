namespace RidderMagnus.Items {
    export function GoudenRing() {
        return BuildItem({
            name: 'Gouden ring',
            damage: '0',
            equipmentType: StoryScript.EquipmentType.Amulet ,
            value: 30
            //requirement: sluipen >0
        });
    }
}