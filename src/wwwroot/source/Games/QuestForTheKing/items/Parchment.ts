module QuestForTheKing.Items {
    export function Parchment(): StoryScript.IKey {
        return {
            name: 'Old Parchment',
            description: StoryScript.Constants.HTML,
            damage: '0',
            equipmentType: StoryScript.EquipmentType.Miscellaneous,
            open: {
                name: 'Read the magic word',
                action: StoryScript.Actions.OpenWithKey((game: IGame, destination: StoryScript.IDestination) => {
                    // Add the read parchment html to the location and trigger playing audio.
                    game.currentLocation.text += game.currentLocation.descriptions['readparchment'];
                    playAudio(game.currentLocation, 'text', game.currentLocation, true);
                })
            }         
        }
    }
}