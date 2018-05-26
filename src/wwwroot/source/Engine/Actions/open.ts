namespace StoryScript.Actions {
    /**
     * A basic function to remove a barrier and then execute a callback function.
     * @param callback 
     */
    export function Open(callback: (game: IGame, destination: StoryScript.IDestination) => void) {
        return function (game: IGame, destination: StoryScript.IDestination) {
            delete destination.barrier;

            if (callback) {
                callback(game, destination);
            }
        }
    }
}