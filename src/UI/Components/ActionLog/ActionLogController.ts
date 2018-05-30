namespace StoryScript {
    export class ActionLogController implements ng.IComponentController {
        constructor(private _game: IGame, private _texts: IInterfaceTexts) {
            var self = this;
            self.game = _game;
            self.texts = _texts;
        }

        game: IGame;
        texts: IInterfaceTexts;
    }

    ActionLogController.$inject = ['game', 'customTexts'];
}