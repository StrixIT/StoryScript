import { IAction, ActionType, Action } from 'storyScript/Interfaces/storyScript';
import { IGame } from '../types';

export interface UnlockSettings {
    text?: string;
    difficulty: number;
    success: (game: IGame) => void;
    fail: (game: IGame) => void;
}

export function Unlock(settings: UnlockSettings): IAction {
    return Action({
        text: settings && settings.text || 'Slot openen',
        actionType: ActionType.Check,
        execute: function (game: IGame) {
            var check = game.helpers.rollDice(game.character.vlugheid + 'd6');
            var result;
            result = check * game.character.vlugheid;

            if (result >= settings.difficulty) {
                settings.success(game);
                return false;
            }
            else {
                settings.fail(game);
                game.logToActionLog('Het lukt niet.');
                return true;
            };
        }
    });
}

//deze button moet active blijven, behalve bij een critical fail misschien. Dus een extra setting, kan dat? 
// Of kunnen we bijvoorbeeld drie pogingen geven voor hij inactive wordt?