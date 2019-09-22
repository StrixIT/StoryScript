namespace StoryScript {
    export class NavigationController implements ng.IComponentController {
        constructor(private _scope: ng.IScope, private _gameService: IGameService, private _game: IGame, private _texts: IInterfaceTexts) {
            var self = this;
            self.texts = _texts;
        }

        texts: IInterfaceTexts;

        menu = (): void => {
            var self = this;
            self._scope.$emit('menu');
        }

        reset = (): void => {
            var self = this;
            self._gameService.reset();
        }
    }

    NavigationController.$inject = ['$scope', 'gameService', 'game', 'customTexts'];
}