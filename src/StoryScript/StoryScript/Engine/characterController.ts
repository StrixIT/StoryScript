module StoryScript {
    export interface ICharacterControllerScope extends ng.IScope {
        game: IGame;
        texts: IInterfaceTexts;
        displayCharacterAttributes: string[];
    }

    export class CharacterController {
        private $scope: ICharacterControllerScope;
        private characterService: ICharacterService;
        private game: IGame;

        constructor($scope: ICharacterControllerScope, characterService: ICharacterService, game: IGame, texts: IInterfaceTexts) {
            var self = this;
            self.$scope = $scope;
            self.characterService = characterService;
            self.game = game;
            self.$scope.game = self.game;
            self.$scope.texts = texts;
            self.$scope.displayCharacterAttributes = self.characterService.getSheetAttributes();
        }

        canEquip = (item: IItem): boolean => {
            return item.equipmentType != StoryScript.EquipmentType.Miscellaneous;
        }

        equipItem = (item: IItem) => {
            var self = this;
            var type = StoryScript.EquipmentType[item.equipmentType];
            type = type.substring(0, 1).toLowerCase() + type.substring(1);

            var equippedItem = self.game.character.equipment[type];

            if (equippedItem) {
                self.game.character.items.push(equippedItem);
            }

            self.game.character.equipment[type] = item;
            self.game.character.items.remove(item);
        }

        unequipItem = (item: IItem) => {
            var self = this;
            var type = StoryScript.EquipmentType[item.equipmentType];
            type = type.substring(0, 1).toLowerCase() + type.substring(1);

            var equippedItem = self.game.character.equipment[type];

            if (equippedItem) {
                self.game.character.items.push(equippedItem);
            }

            self.game.character.equipment[type] = null;
        }

        isSlotUsed = (slot: string) => {
            var self = this;

            if (self.game.character) {
                return self.game.character.equipment[slot] !== undefined;
            }
        }

        dropItem = (item: IItem): void => {
            var self = this;
            self.game.character.items.remove(item);
            self.game.currentLocation.items.push(item);
        }

        useItem = (item: IItem): void => {
            var self = this;
            item.use(self.game, item);
        }
    }

    CharacterController.$inject = ['$scope', 'characterService', 'game', 'customTexts'];
}