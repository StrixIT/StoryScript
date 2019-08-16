namespace StoryScript.Actions {
    /**
     * A basic function to remove a barrier using a key and then execute a callback function. When it is not specified that the player
     * should keep the key after using it, it is removed from his item list.
     * @param callBack 
     */
    export function OpenWithKey(callBack?: (game: IGame, destination: IDestination) => void) {
        return (game: IGame, destination: IDestination) => {
            var key = typeof destination.barrier.key === 'function' ? destination.barrier.key() : <IKey>game.helpers.getItem(destination.barrier.key);

            if (key.keepAfterUse === undefined || key.keepAfterUse !== true) {
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