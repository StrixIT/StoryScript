namespace StoryScript {
    export class LevelUpController implements ng.IComponentController {
        constructor(private _scope: StoryScriptScope, private _gameService: IGameService, private _characterService: ICharacterService, private _game: IGame, _texts: IInterfaceTexts) {
            this.game = _game;
            this.texts = _texts;
            this._scope.game = _game;

            this._scope.$watch('game.state', (newValue: GameState) => {
                if (newValue == GameState.LevelUp) {
                    this.sheet = this._characterService.setupLevelUp();
                    this._game.playState = null;
                }
            });
        }

        sheet: ICreateCharacter;
        game: IGame;
        texts: IInterfaceTexts;

        distributionDone = (step: ICreateCharacterStep): boolean => this._characterService.distributionDone(this.sheet, step);

        levelUp = (): ICharacter => this._gameService.levelUp(this.sheet);
    }

    LevelUpController.$inject = ['$scope', 'gameService', 'characterService', 'game', 'customTexts'];
}