namespace DangerousCave.Actions {
    export function Inspect(text: string) {
        return function (game: IGame, barrier: StoryScript.IBarrier, destination: StoryScript.IDestination): void {
            if (text) {
                game.logToLocationLog(text);
            }
        }
    }
}