namespace DangerousCave.Items {
    export function BlackKey() {
        return Key({
            name: 'Black key',
            description: 'This black iron key has a gargoyle figurine on it.',
            equipmentType: StoryScript.EquipmentType.Miscellaneous,
            open: {
                name: 'Open de deur met de zwarte sleutel',
                action: StoryScript.Actions.OpenWithKey((game: IGame, destination: StoryScript.IDestination) => {
                    game.logToLocationLog('Je opent de deur.');
                    destination.name = 'Donkere kamer';
                })
            }
        });
    }
}