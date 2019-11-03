
export class HighScoresController implements ng.IComponentController {
    constructor(_game: StoryScript.IGame, _texts: StoryScript.IInterfaceTexts) {
        this.game = _game;
        this.texts = _texts;
    }

    game: StoryScript.IGame;
    texts: StoryScript.IInterfaceTexts;
}

HighScoresController.$inject = ['game', 'customTexts'];