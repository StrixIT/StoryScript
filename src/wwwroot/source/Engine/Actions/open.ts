namespace StoryScript.Actions {
    export function Open(callback: (game: IGame, destination: StoryScript.IDestination) => void) {
        return function (game: IGame, destination: StoryScript.IDestination) {
            delete destination.barrier;

            if (callback) {
                callback(game, destination);
            }
        }
    }
}