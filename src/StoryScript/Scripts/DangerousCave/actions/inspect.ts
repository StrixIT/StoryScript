module DangerousCave.Actions {
    export function Inspect(text: string) {
        return function (game: IGame, destination: StoryScript.IDestination, barrier: StoryScript.IBarrier, action: StoryScript.IBarrierAction): void {
            var index = barrier.actions.indexOf(action);

            if (index > -1) {
                barrier.actions.splice(index, 1);
                barrier.selectedAction = barrier.actions.first();
            }

            if (text) {
                game.logToLocationLog(text);
            }
        }
    }
}