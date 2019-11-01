namespace StoryScript {
    export class GameOverController implements ng.IComponentController {
        constructor(private _scope: ng.IScope, _game: IGame, _texts: IInterfaceTexts) {
            this.game = _game;
            this.texts = _texts;
        }

        game: IGame;
        texts: IInterfaceTexts;

        restart = (): ng.IAngularEvent => this._scope.$emit('restart');
    }

    GameOverController.$inject = ['$scope', 'game', 'customTexts'];
}