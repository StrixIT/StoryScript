namespace StoryScript {   
    export class LocationController implements ng.IComponentController {
        constructor(private _gameService: IGameService, private _game: IGame, private _texts: IInterfaceTexts) {
            var self = this;
            self.game = _game;
            self.texts = _texts;
        }

        game: IGame;
        texts: IInterfaceTexts;

        getDescription(entity: any, key: string) {
            var self = this;
            return self._gameService.getDescription(entity, key);
        }
    }

    LocationController.$inject = ['gameService', 'game', 'customTexts'];
}