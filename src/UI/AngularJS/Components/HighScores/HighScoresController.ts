namespace StoryScript {
    export class HighScoresController implements ng.IComponentController {
        constructor(_game: IGame, _texts: IInterfaceTexts) {
            this.game = _game;
            this.texts = _texts;
        }

        game: IGame;
        texts: IInterfaceTexts;
    }

    HighScoresController.$inject = ['game', 'customTexts'];
}