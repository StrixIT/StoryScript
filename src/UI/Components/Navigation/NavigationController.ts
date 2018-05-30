namespace StoryScript {
    export class NavigationController implements ng.IComponentController {
        constructor(private _scope: ng.IScope, private _gameService: IGameService, private _texts: IInterfaceTexts) {
            var self = this;
            self.texts = _texts;
        }

        texts: IInterfaceTexts;

        reset = (): void => {
            var self = this;
            self._gameService.reset();
        }

        restart = (): void => {
            var self = this;
            self._gameService.restart();
            self._scope.$emit('restart');
        }

        save = (): void => {
            var self = this;
            self._scope.$emit('saveGame');
        }

        load = (): void => {
            var self = this;
            self._scope.$emit('loadGame');
        }
    }

    NavigationController.$inject = ['$scope', 'gameService', 'customTexts'];
}