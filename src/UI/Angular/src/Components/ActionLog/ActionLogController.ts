export class ActionLogController implements ng.IComponentController {
    constructor(_game: StoryScript.IGame, _texts: StoryScript.IInterfaceTexts) {
        this.game = _game;
        this.texts = _texts;
    }

    game: StoryScript.IGame;
    texts: StoryScript.IInterfaceTexts;
}

ActionLogController.$inject = ['game', 'customTexts'];