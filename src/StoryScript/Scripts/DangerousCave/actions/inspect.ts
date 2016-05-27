module StoryScript.Actions {
    export function Inspect(text: string) {
        return function (game: Game, barrier: Interfaces.IBarrier, action: Interfaces.IBarrierAction): void {
            for (var n in barrier.actions) {
                var currentAction = barrier.actions.first(action);

                if (currentAction == action) {
                    delete barrier.actions[n];
                    barrier.selectedAction = barrier.actions.first();
                }
            }

            if (text) {
                game.logToLocationLog(text);
            }
        }
    }
}