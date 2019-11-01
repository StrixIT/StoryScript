namespace StoryScript {
    export class CreateCharacterController implements ng.IComponentController {
        constructor(private _scope: StoryScriptScope, private _characterService: ICharacterService, private _gameService: IGameService, private _game: IGame, _texts: IInterfaceTexts) {
            this.game = _game;
            this.texts = _texts;
            this._scope.game = _game;

            this._scope.$watch('game.state', (newValue: GameState) => {
                if (newValue == GameState.CreateCharacter) {
                    this.sheet = this._characterService.setupCharacter();
                }
            });
        }

        sheet: ICreateCharacter;
        game: IGame;
        texts: IInterfaceTexts;

        startNewGame = () => this._gameService.startNewGame(this._game.createCharacterSheet);

        distributionDone = (step: ICreateCharacterStep): boolean => this._characterService.distributionDone(this.sheet, step);
    }

    CreateCharacterController.$inject = ['$scope', 'characterService', 'gameService', 'game', 'customTexts'];
}