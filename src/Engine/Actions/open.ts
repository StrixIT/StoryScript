namespace StoryScript.Actions {
    /**
     * A basic function to remove a barrier and then execute a callback function.
     * @param callback 
     */
    export function Open(callback?: (game: IGame, barrier: IBarrier, destination: IDestination) => void) {
        return function (game: IGame, barrier: IBarrier, destination: IDestination) {
            delete destination.barrier;

            if (callback) {
                callback(game, barrier, destination);
            }
        }
    }
}