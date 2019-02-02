module QuestForTheKing.Items {
    export function Parchment(): StoryScript.IKey {
        return {
            name: 'Old Parchment',
            damage: '0',
            equipmentType: StoryScript.EquipmentType.Miscellaneous,
            open: {
                name: 'Read the magic word',
                action: StoryScript.Actions.OpenWithKey((game: IGame, destination: StoryScript.IDestination) => {
                    // Add the read parchment html to the location. This will also trigger playing the audio element.
                    game.currentLocation.text += game.currentLocation.descriptions['readparchment'];
                })
            }         
        }
    }
}