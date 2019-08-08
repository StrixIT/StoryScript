namespace RidderMagnus.Items {
    export function LichtSpreuk() {
        return Item({
            name: 'Licht (spreuk)',
            equipmentType: StoryScript.EquipmentType.Miscellaneous,
            description: 'Een magisch licht dat de duisternis verjaagt.',
            use: (game: IGame) => {
                game.currentLocation.text = game.currentLocation.descriptions["light"] || game.currentLocation.text;
                game.logToActionLog('Een helder licht straalt vanuit je handen en verlicht een grote kring rondom je.');
            },
            value: 10
            //requirement: toveren >0
        });
    }
}