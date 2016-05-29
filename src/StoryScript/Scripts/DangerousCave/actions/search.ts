module DangerousCave {
    export interface SearchSettings {
        text?: string;
        active?: (parameters: any) => boolean;
        difficulty: number;
        success: (game: Game) => void;
        fail: (game: Game) => void;
    }
}

module DangerousCave.Actions {
    export function Search(settings: SearchSettings): StoryScript.IAction {
        var text = settings.text || 'Zoek';

        return {
            text: text,
            type: 'skill',
            active: settings.active == undefined ? () => { return true; } : settings.active,
            execute: function (game: Game) {
                var check = game.rollDice(game.character.oplettendheid + 'd6');
                var result;
                result = check * game.character.oplettendheid;

                // Todo: think of something simpler to remove actions.
                var action = game.currentLocation.actions.first({ callBack: (x: StoryScript.IAction) => { return x.text === text; } });
                game.currentLocation.actions.remove(action);

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