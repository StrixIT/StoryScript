
namespace StoryScript {
    export class IntroController {
        constructor(private _scope: ng.IScope, private _gameService: IGameService, private _game: IGame, private _texts: IInterfaceTexts) {
            var self = this;
            self.game = _game;
            self.texts = _texts;
        }

        game: IGame;
        texts: IInterfaceTexts;

        endIntro = (): void => {
            var self = this;
            self._gameService.restart(true);
        }
    }

    IntroController.$inject = ['$scope', 'gameService', 'game', 'customTexts'];
}