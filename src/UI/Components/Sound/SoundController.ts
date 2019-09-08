
namespace StoryScript {
    export class SoundController {
        constructor(private _scope: ng.IScope, private _gameService: IGameService) {
            var self = this;
        }

        getCurrentMusic= (): string => {
            var self = this;
            return self._gameService.getCurrentMusic();
        }
    }

    SoundController.$inject = ['$scope', 'gameService'];
}