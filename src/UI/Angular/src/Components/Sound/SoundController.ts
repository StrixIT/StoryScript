
export class SoundController {
    constructor(private _gameService: StoryScript.IGameService) {
    }

    getCurrentMusic = (): string => this._gameService.getCurrentMusic();
}

SoundController.$inject = ['gameService'];