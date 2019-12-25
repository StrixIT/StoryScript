import { IAction, Action, ActionType, ActionStatus } from 'storyScript/Interfaces/storyScript';
import { IGame } from '../types';
import { isEmpty } from 'storyScript/utilities';

export function Flee(text: string): IAction {
    return Action({
        text: text || 'Vluchten!',
        actionType: ActionType.Check,
        status: (game: IGame) => {
            return isEmpty(game.currentLocation.activeEnemies) ? ActionStatus.Unavailable : ActionStatus.Available;
        },
        execute: (game: IGame) => {
            var check = game.helpers.rollDice(game.character.vlugheid + 'd6');
            var result = check * game.character.vlugheid;
            var totalHitpoints = 0;

            game.currentLocation.activeEnemies.forEach(function (enemy) {
                totalHitpoints += enemy.hitpoints;
            });

            if (result >= totalHitpoints / 2) {
                game.changeLocation();
            }
            else {
                game.logToCombatLog('Je ontsnapping mislukt!');
            };

            return true;
        }
    });
}