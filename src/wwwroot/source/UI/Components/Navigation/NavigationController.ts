namespace StoryScript {
    interface INavigationControllerScope extends ng.IScope {
        texts: IInterfaceTexts;
    }
    
    export class NavigationController implements ng.IComponentController {
        constructor(private _scope: INavigationControllerScope, private _gameService: IGameService, private _texts: IInterfaceTexts) {
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
            self._scope.$broadcast('restart');
        }
    }

    NavigationController.$inject = ['$scope', 'gameService', 'customTexts'];
}