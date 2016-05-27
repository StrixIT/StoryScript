module StoryScript.Actions {
    export function OpenWithKey(callBack: (game: DangerousCave.Game, destination: IDestination) => void) {
        return function (game: DangerousCave.Game, destination: IDestination) {
            // Todo: remove the key used from the character's inventory.

            delete destination.barrier;

            if (callBack) {
                callBack(game, destination);
            }
        }
    }
}