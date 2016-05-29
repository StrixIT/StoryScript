module DangerousCave.Actions {
    export function Open(callback: (game: Game, destination: StoryScript.IDestination) => void) {
        return function (game: Game, destination: StoryScript.IDestination) {
            delete destination.barrier;

            if (callback) {
                callback(game, destination);
            }
        }
    }
}