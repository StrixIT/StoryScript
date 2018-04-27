namespace StoryScript.Actions {
    export function OpenWithKey(callBack: (game: IGame, destination: StoryScript.IDestination) => void) {
        return function (game: IGame, destination: StoryScript.IDestination) {
            var key = destination.barrier.key;
            var keepAfterUse = (<any>key).keepAfterUse;

            if (keepAfterUse === undefined || keepAfterUse !== true) {
                // Cater for the situation that the player dropped the key before activating the open action.
                game.character.items.remove(key);
                game.currentLocation.items.remove(key);
            }

            delete destination.barrier;

            if (callBack) {
                callBack(game, destination);
            }
        }
    }
}