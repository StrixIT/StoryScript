module QuestForTheKing.Items {
    export function Parchment() {
        return Key( {
            name: 'Old Parchment',
            damage: '0',
            equipmentType: StoryScript.EquipmentType.Miscellaneous,
            open: {
                text: 'Read the magic word',
                execute: StoryScript.Actions.OpenWithKey((game: IGame, destination: StoryScript.IDestination) => {
                    // Add the read parchment html to the location. This will also trigger playing the audio element.
                    game.logToLocationLog(game.currentLocation.descriptions['readparchment']);
                })
            }         
        });
    }
}