namespace StoryScript {
    export class CreateCharacterController implements ng.IComponentController {
        constructor(private _scope: StoryScriptScope, private _characterService: ICharacterService, private _gameService: IGameService, private _game: IGame, private _texts: IInterfaceTexts) {
            var self = this;
            self.game = _game;
            self.texts = _texts;
            self._scope.game = self._game;

            self._scope.$watch('game.state', (newValue: GameState) => {
                if (newValue == GameState.CreateCharacter) {
                    self.sheet = self._characterService.setupCharacter();
                }
            });
        }

        sheet: ICreateCharacter;
        game: IGame;
        texts: IInterfaceTexts;

        startNewGame = () => {
            var self = this;
            self._gameService.startNewGame(self._game.createCharacterSheet);
        }

        distributionDone = (step: ICreateCharacterStep) => {
            var self = this;
            return self._characterService.distributionDone(self.sheet, step);
        }
    }

    CreateCharacterController.$inject = ['$scope', 'characterService', 'gameService', 'game', 'customTexts'];
}