module StoryScript.Actions {
    export function Open(callback: (game: Game, destination: Interfaces.IDestination) => void) {
        return function (game: Game, destination: Interfaces.IDestination) {
            delete destination.barrier;

            if (callback) {
                callback(game, destination);
            }
        }
    }
}