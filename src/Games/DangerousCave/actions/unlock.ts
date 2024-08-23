import { IAction, ActionType } from 'storyScript/Interfaces/storyScript';
import { IGame } from '../types';

export interface UnlockSettings {
    text?: string;
    difficulty: number;
    success: (game: IGame) => void;
    fail: (game: IGame) => void;
}

export function Unlock(settings: UnlockSettings): IAction {
    return {
        text: settings?.text || 'Slot openen',
        actionType: ActionType.Check,
        execute: function (game: IGame) {
            const check = game.helpers.rollDice(game.activeCharacter.vlugheid + 'd6');
            let result;
            result = check * game.activeCharacter.vlugheid;

            if (result >= settings.difficulty) {
                settings.success(game);
                return false;
            }
            else {
                settings.fail(game);
                game.logToActionLog('Het lukt niet.');
                return true;
            }
        }
    };
}

//deze button moet active blijven, behalve bij een critical fail misschien. Dus een extra setting, kan dat? 
// Of kunnen we bijvoorbeeld drie pogingen geven voor hij inactive wordt?