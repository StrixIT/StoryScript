module DangerousCave.Actions {
    export function Unlock(settings: any): StoryScript.IAction {
        return {
            text: settings.text || 'Slot openen',
            type: 'skill',
            active: settings.active == undefined ? true : settings.active,
            execute: function (game: Game) {
                var check = game.rollDice(game.character.vlugheid + 'd6');
                var result;
                result = check * game.character.vlugheid;

                if (result >= settings.difficulty) {
                    settings.success(game);
                }
                else {
                    settings.fail(game);
                    game.logToActionLog('Het lukt niet.');
                };
            }
        }
    }
}

//deze button moet active blijven, behalve bij een critical fail misschien. Dus een extra setting, kan dat? 
// Of kunnen we bijvoorbeeld drie pogingen geven voor hij inactive wordt?