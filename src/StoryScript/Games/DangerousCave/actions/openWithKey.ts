module DangerousCave.Actions {
    export function OpenWithKey(callBack: (game: IGame, destination: StoryScript.IDestination) => void) {
        return function (game: IGame, destination: StoryScript.IDestination) {
            // Todo: remove the key used from the character's inventory.

            delete destination.barrier;

            if (callBack) {
                callBack(game, destination);
            }
        }
    }
}