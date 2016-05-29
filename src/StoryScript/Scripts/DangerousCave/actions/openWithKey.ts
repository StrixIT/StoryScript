module DangerousCave.Actions {
    export function OpenWithKey(callBack: (game: Game, destination: StoryScript.IDestination) => void) {
        return function (game: Game, destination: StoryScript.IDestination) {
            // Todo: remove the key used from the character's inventory.

            delete destination.barrier;

            if (callBack) {
                callBack(game, destination);
            }
        }
    }
}