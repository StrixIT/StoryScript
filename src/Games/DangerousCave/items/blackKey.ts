namespace DangerousCave.Items {
    export function BlackKey() {
        return Key({
            name: 'Zwarte sleutel',
            description: 'Op deze zwarte sleutel staat de afbeelding van een waterspuwer.',
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