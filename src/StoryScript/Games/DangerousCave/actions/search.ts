module DangerousCave {
    export interface SearchSettings {
        text?: string;
        difficulty: number;
        success: (game: IGame) => void;
        fail: (game: IGame) => void;
    }
}

module DangerousCave.Actions {
    export function Search(settings: SearchSettings): StoryScript.IAction {
        var text = settings.text || 'Zoek';

        return {
            text: text,
            type: StoryScript.ActionType.Check,
            execute: function (game: IGame) {
                var result;
                var check = StoryScript.Functions.rollDice(game.character.oplettendheid + 'd6');
                result = check * game.character.oplettendheid;

                if (result >= settings.difficulty) {
                    settings.success(game);
                }
                else {
                    settings.fail(game);
                };
            }
        }
    }
}