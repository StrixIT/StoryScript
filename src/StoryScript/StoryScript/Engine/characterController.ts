module StoryScript {
    export interface ICharacterControllerScope extends ng.IScope {
        game: IGame;
        texts: IInterfaceTexts;
        displayCharacterAttributes: string[];
    }

    export class CharacterController {
        private $scope: ICharacterControllerScope;
        private characterService: ICharacterService;
        private ruleService: IRuleService;
        private game: IGame;

        constructor($scope: ICharacterControllerScope, characterService: ICharacterService, ruleService: IRuleService, game: IGame, texts: IInterfaceTexts) {
            var self = this;
            self.$scope = $scope;
            self.characterService = characterService;
            self.ruleService = ruleService;
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

            var equipmentTypes = Array.isArray(item.equipmentType) ? <EquipmentType[]>item.equipmentType : [<EquipmentType>item.equipmentType];

            for (var n in equipmentTypes) {
                var type = self.getEquipmentType(equipmentTypes[n]);
                self.unequip(type);
            }

            if (self.ruleService.beforeEquip) {
                if (!self.ruleService.beforeEquip(self.game.character, item)) {
                    return;
                }
            }

            for (var n in equipmentTypes) {
                var type = self.getEquipmentType(equipmentTypes[n]);
                self.game.character.equipment[type] = item;
            }

            self.game.character.items.remove(item);
        }

        unequipItem = (item: IItem) => {
            var self = this;
            var equipmentTypes = Array.isArray(item.equipmentType) ? <EquipmentType[]>item.equipmentType : [<EquipmentType>item.equipmentType];

            for (var n in equipmentTypes) {
                var type = self.getEquipmentType(equipmentTypes[n]);
                self.unequip(type);
            }
        }

        private unequip(type: string, currentItem?: IItem) {
            var self = this;
            var equippedItem = self.game.character.equipment[type];

            if (equippedItem) {
                if (Array.isArray(equippedItem.equipmentType) && !currentItem) {
                    for (var n in equippedItem.equipmentType) {
                        var type = self.getEquipmentType(equippedItem.equipmentType[n]);
                        self.unequip(type, equippedItem);
                    }
                }

                if (self.ruleService.beforeUnequip) {
                    if (!self.ruleService.beforeUnequip(self.game.character, equippedItem)) {
                        return;
                    }
                }

                if (equippedItem && equippedItem.equipmentType && self.game.character.items.indexOf(equippedItem) === -1) {
                    self.game.character.items.push(equippedItem);
                }

                self.game.character.equipment[type] = null;
            }
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

        questStatus = (quest: IQuest): string => {
            var self = this;
            return typeof quest.status === 'function' ? (<any>quest).status(self.game, quest, quest.checkDone(self.game, quest)) : quest.status;
        }

        private getEquipmentType = (slot: StoryScript.EquipmentType) => {
            var type = StoryScript.EquipmentType[slot];
            return type.substring(0, 1).toLowerCase() + type.substring(1);
        }
    }

    CharacterController.$inject = ['$scope', 'characterService', 'ruleService', 'game', 'customTexts'];
}