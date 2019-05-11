namespace RidderMagnus.Items {
    export function Tovermantel() {
        return Item({
            name: 'Tovermantel',
            equipmentType: StoryScript.EquipmentType.Body,
            description: 'Een witte mantel die in het licht glinstert in alle kleuren van de regenboog. Hij beschermt je en versterkt je toverkracht.',
            bonuses: {
                toveren: 1
            },
            defense: 1 ,
            value: 15
            //requirement: toveren >0
        });
    }
}