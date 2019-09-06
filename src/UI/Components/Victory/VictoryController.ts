namespace StoryScript {
    export class VictoryController implements ng.IComponentController {
        constructor(private _scope: ng.IScope, private _gameService: IGameService, private _game: IGame, private _texts: IInterfaceTexts) {
            var self = this;
            self.game = _game;
            self.texts = _texts;
        }

        game: IGame;
        texts: IInterfaceTexts;

        restart = (): void => {
            var self = this;
            self._scope.$emit('restart');
        }
    }

    VictoryController.$inject = ['$scope', 'gameService', 'game', 'customTexts'];
}