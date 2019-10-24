namespace StoryScript {
    export class VictoryController implements ng.IComponentController {
        constructor(private _scope: ng.IScope, _game: IGame, _texts: IInterfaceTexts) {
            this.game = _game;
            this.texts = _texts;
        }

        game: IGame;
        texts: IInterfaceTexts;

        restart = (): ng.IAngularEvent => this._scope.$emit('restart');
    }

    VictoryController.$inject = ['$scope', 'game', 'customTexts'];
}