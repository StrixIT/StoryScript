module DangerousCave.Items {
    export function BlackKey(): StoryScript.IKey {
        return {
            name: 'Black key',
            description: 'This black iron key has a gargoyle figurine on it.',
            equipmentType: StoryScript.EquipmentType.Miscellaneous,
            open: {
                text: 'Open de deur met de zwarte sleutel',
                action: Actions.OpenWithKey((game: IGame, destination: StoryScript.IDestination) => {
                    game.logToLocationLog('Je opent de deur.');
                    destination.text = 'Donkere kamer';
                })
            }
        }
    }
}