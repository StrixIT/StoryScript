module StoryScript.Actions {
    export function OpenWithKey(callBack: (game: IGame, destination: StoryScript.IDestination) => void) {
        return function (game: IGame, destination: StoryScript.IDestination) {
            var key = destination.barrier.key;
            var keepAfterUse = key().keepAfterUse;

            if (keepAfterUse !== undefined && keepAfterUse !== true) {
                game.character.items.remove(key);
            }

            delete destination.barrier;

            if (callBack) {
                callBack(game, destination);
            }
        }
    }
}