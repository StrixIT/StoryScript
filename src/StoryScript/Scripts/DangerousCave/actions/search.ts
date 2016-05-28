module StoryScript {
    export interface SearchSettings {
        text?: string;
        active?: (parameters: any) => boolean;
        difficulty: number;
        success: (game: DangerousCave.Game) => void;
        fail: (game: DangerousCave.Game) => void;
    }
}

module StoryScript.Actions {
    export function Search(settings: SearchSettings): IAction {
        var text = settings.text || 'Zoek';

        return {
            text: text,
            type: 'skill',
            active: settings.active == undefined ? () => { return true; } : settings.active,
            execute: function (game: DangerousCave.Game) {
                var check = game.rollDice(game.character.oplettendheid + 'd6');
                var result;
                result = check * game.character.oplettendheid;

                // Todo: think of something simpler to remove actions.
                var action = game.currentLocation.actions.first({ callBack: (x: IAction) => { return x.text === text; } });
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