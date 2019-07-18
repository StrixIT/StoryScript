namespace RidderMagnus.Actions {
    export function Flee(text: string): StoryScript.IAction {
        return {
            text: text || 'Vluchten!',
            actionType: StoryScript.ActionType.Check,
            status: function (game: IGame) {
                return StoryScript.isEmpty(game.currentLocation.activeEnemies) ? StoryScript.ActionStatus.Unavailable : StoryScript.ActionStatus.Available;
            },
            execute: function (game: IGame) {
                var check = game.helpers.rollDice(game.character.snelheid + 'd6');
                var result = check * game.character.snelheid;
                var totalHitpoints = 0;

                game.currentLocation.activeEnemies.forEach(function (enemy) {
                    totalHitpoints += enemy.hitpoints;
                });

                if (result >= totalHitpoints / 2) {
                    game.state = StoryScript.GameState.Play;
                    game.changeLocation();
                    game.logToActionLog('Je bent onsnapt.');
                }
                else {
                    game.logToCombatLog('Je bent niet snel genoeg!');
                };
            }
        }
    }
}