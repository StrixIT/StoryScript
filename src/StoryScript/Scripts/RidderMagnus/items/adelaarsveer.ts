module RidderMagnus.Items {
    export function Adelaarsveer(): IItem {
        return {
            name: 'Adelaarsveer',
            equipmentType: StoryScript.EquipmentType.Amulet,
            description: 'Een verzilverde veer aan een zilveren ketting. Men zegt dat de drager er scherpere ogen van krijgt.' ,
            bonuses: {
                zoeken: 1
            },
            price: 11
            //requirement: zoeken >1
        }
    }
}