module DangerousCave {
    export interface SearchSettings {
        text?: string;
        active?: (parameters: any) => boolean;
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
            type: 'skill',
            active: settings.active == undefined ? () => { return true; } : settings.active,
            execute: function (game: IGame) {
                var result;
                var check = game.rollDice(game.character.oplettendheid + 'd6');
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