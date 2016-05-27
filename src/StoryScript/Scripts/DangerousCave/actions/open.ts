module StoryScript.Actions {
    export function Open(callback: (game: DangerousCave.Game, destination: IDestination) => void) {
        return function (game: DangerousCave.Game, destination: IDestination) {
            delete destination.barrier;

            if (callback) {
                callback(game, destination);
            }
        }
    }
}