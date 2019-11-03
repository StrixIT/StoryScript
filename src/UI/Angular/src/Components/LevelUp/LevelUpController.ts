export class LevelUpController implements ng.IComponentController {
    constructor(private _gameService: StoryScript.IGameService, private _characterService: StoryScript.ICharacterService, private _game: StoryScript.IGame, _texts: StoryScript.IInterfaceTexts) {
        this.game = _game;
        this.texts = _texts;
    }

    sheet: StoryScript.ICreateCharacter;
    game: StoryScript.IGame;
    texts: StoryScript.IInterfaceTexts;

    distributionDone = (step: StoryScript.ICreateCharacterStep): boolean => this._characterService.distributionDone(this.sheet, step);

    levelUp = (): StoryScript.ICharacter => this._gameService.levelUp();
}

LevelUpController.$inject = ['gameService', 'characterService', 'game', 'customTexts'];