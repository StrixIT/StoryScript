namespace DangerousCave.Items {
    export function BlackKey() {
        return Key({
            name: 'Zwarte sleutel',
            description: 'Op deze zwarte sleutel staat de afbeelding van een waterspuwer.',
            equipmentType: StoryScript.EquipmentType.Miscellaneous,
            open: {
                text: 'Open de deur met de zwarte sleutel',
                execute: StoryScript.Actions.OpenWithKey((game: IGame, destination: StoryScript.IDestination) => {
                    game.logToLocationLog('Je opent de deur.');
                    destination.name = 'Donkere kamer';
                })
            }
        });
    }
}