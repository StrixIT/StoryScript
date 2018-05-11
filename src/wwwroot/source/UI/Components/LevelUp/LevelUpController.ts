namespace StoryScript {
    export class LevelUpController implements ng.IComponentController {
        constructor(private _scope: ng.IScope, private _characterService: ICharacterService, private _game: IGame, private _texts: IInterfaceTexts) {
            var self = this;
            self.game = _game;
            self.texts = _texts;

            self._scope.$on('initLevelUp', function (event: ng.IAngularEvent) {
                self.sheet = self._characterService.setupLevelUp();
            });
        }

        sheet: ICreateCharacter;
        game: IGame;
        texts: IInterfaceTexts;

        distributionDone = (step: ICreateCharacterStep) => {
            var self = this;
            return self._characterService.distributionDone(self.sheet, step);
        }

        levelUp = () => {
            var self = this;
            self._characterService.levelUp(self._game, self.sheet);
        }
    }

    LevelUpController.$inject = ['$scope', 'characterService', 'game', 'customTexts'];
}