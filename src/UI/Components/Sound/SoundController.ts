
namespace StoryScript {
    export class SoundController {
        constructor(private _gameService: IGameService) {
        }

        getCurrentMusic= (): string => this._gameService.getCurrentMusic();
    }

    SoundController.$inject = ['gameService'];
}