module DangerousCave.Items {
    export function BlackKey(): StoryScript.IKey {
        return {
            name: 'Black key',
            description: 'This black iron key has a gargoyle figurine on it.',
            equipmentType: StoryScript.EquipmentType.Miscellaneous,
            open: {
                text: 'Open de deur met de zwarte sleutel',
                // Todo: does this work? How does the callback get access to the game and destination?
                execute: (parameters) => Actions.OpenWithKey((game: Game, destination: StoryScript.IDestination) => {
                    game.logToLocationLog('Je opent de deur.');
                    destination.text = 'Donkere kamer';
                })
            }

            //(game: Game): IAction => {
            //return function() {
            //    text: 'Open de deur met de zwarte sleutel',
            //    execute: Actions.OpenWithKey({
            //        success: function (game, destination) {
            //            game.logLocation('Je opent de deur.');
            //            destination.text = 'Donkere kamer';
            //        }
            //    })
            //}
        }
    }
}