module DangerousCave {
    export interface UnlockSettings {
        text?: string;
        difficulty: number;
        success: (game: IGame) => void;
        fail: (game: IGame) => void;
    }
}

module DangerousCave.Actions {
    export function Unlock(settings: UnlockSettings): StoryScript.IAction {
        return {
            text: settings.text || 'Slot openen',
            type: StoryScript.ActionType.Check,
            execute: function (game: IGame) {
                var check = game.rollDice(game.character.vlugheid + 'd6');
                var result;
                result = check * game.character.vlugheid;

                if (result >= settings.difficulty) {
                    settings.success(game);
                }
                else {
                    settings.fail(game);
                    game.logToActionLog('Het lukt niet.');
                    return true;
                };
            }
        }
    }
}

//deze button moet active blijven, behalve bij een critical fail misschien. Dus een extra setting, kan dat? 
// Of kunnen we bijvoorbeeld drie pogingen geven voor hij inactive wordt?