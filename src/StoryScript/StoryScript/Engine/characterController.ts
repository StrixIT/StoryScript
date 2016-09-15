module StoryScript {
    export interface ICharacterControllerScope extends ng.IScope {
        character: ICharacter;
        texts: IInterfaceTexts;
        displayCharacterAttributes: string[];
    }

    export class CharacterController {
        private $scope: ICharacterControllerScope;
        private characterService: ICharacterService;

        constructor($scope: ICharacterControllerScope, characterService: ICharacterService, game: IGame, texts: IInterfaceTexts) {
            var self = this;
            self.$scope = $scope;
            self.characterService = characterService;
            self.$scope.character = game.character;
            self.$scope.texts = texts;
            self.$scope.displayCharacterAttributes = self.characterService.getSheetAttributes();
        }

        canEquip = (item: IItem): boolean => {
            var self = this;
            return self.characterService.canEquip(item);
        }

        equipItem = (item: IItem) => {
            var self = this;
            return self.characterService.equipItem(item);
        }

        unequipItem = (item: IItem) => {
            var self = this;
            return self.characterService.unequipItem(item);
        }

        isSlotUsed(slot: string) {
            var self = this;
            return self.characterService.isSlotUsed(slot);
        }

        dropItem = (item: IItem): void => {
            var self = this;
            return self.characterService.dropItem(item);
        }

        useItem = (item: IItem): void => {
            var self = this;
            return self.characterService.useItem(item);
        }
    }

    CharacterController.$inject = ['$scope', 'characterService', 'game', 'customTexts'];
}