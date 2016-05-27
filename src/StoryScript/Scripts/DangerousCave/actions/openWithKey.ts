module StoryScript.Actions {
    export function OpenWithKey(callBack: (game: Game, destination: Interfaces.IDestination) => void) {
        return function (game: Game, destination: Interfaces.IDestination) {
            // Todo: remove the key used from the character's inventory.

            delete destination.barrier;

            if (callBack) {
                callBack(game, destination);
            }
        }
    }
}