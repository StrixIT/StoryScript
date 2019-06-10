namespace DangerousCave {
    export interface UnlockSettings {
        text?: string;
        difficulty: number;
        success: (game: IGame) => void;
        fail: (game: IGame) => void;
    }
}

namespace DangerousCave.Actions {
    export function Unlock(settings: UnlockSettings): StoryScript.IAction {
        return Action({
            text: settings && settings.text || 'Slot openen',
            actionType: StoryScript.ActionType.Check,
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
}

//deze button moet active blijven, behalve bij een critical fail misschien. Dus een extra setting, kan dat? 
// Of kunnen we bijvoorbeeld drie pogingen geven voor hij inactive wordt?