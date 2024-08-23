import { IAction, ActionType, ActionStatus } from 'storyScript/Interfaces/storyScript';
import { IGame } from '../types';
import {isEmpty} from "storyScript/utilityFunctions.ts";

export function Flee(text: string): IAction {
    return {
        text: text || 'Vluchten!',
        actionType: ActionType.Check,
        status: (game: IGame) => {
            return isEmpty(game.currentLocation.activeEnemies) ? ActionStatus.Unavailable : ActionStatus.Available;
        },
        execute: (game: IGame) => {
            const check = game.helpers.rollDice(game.activeCharacter.vlugheid + 'd6');
            const result = check * game.activeCharacter.vlugheid;
            let totalHitpoints = 0;

            game.currentLocation.activeEnemies.forEach(function (enemy) {
                totalHitpoints += enemy.hitpoints;
            });

            if (result >= totalHitpoints / 2) {
                game.changeLocation();
            }
            else {
                game.logToCombatLog('Je ontsnapping mislukt!');
            }

            return true;
        }
    };
}