namespace DangerousCave.Actions {
    export function Inspect(text: string) {
        return function (game: IGame, destination: StoryScript.IDestination, barrier: StoryScript.IBarrier, action: StoryScript.IBarrierAction): void {
            if (text) {
                game.logToLocationLog(text);
            }
        }
    }
}