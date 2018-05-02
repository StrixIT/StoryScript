namespace StoryScript {
    export class CharacterSheetController {
        constructor(private _scope: ng.IScope, private _characterService: ICharacterService, private _rules: IRules, private _game: IGame, private _texts: IInterfaceTexts) {
            var self = this;
            self.character = self._game.character;
            self.texts = self._texts;
            self.displayCharacterAttributes = self._characterService.getSheetAttributes();
        }

        character: ICharacter;
        texts: IInterfaceTexts;
        displayCharacterAttributes: string[];

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

            if (self._rules.beforeEquip) {
                if (!self._rules.beforeEquip(self._game, self._game.character, item)) {
                    return;
                }
            }

            if (item.equip) {
                if (!item.equip(item, self._game)) {
                    return;
                }
            }

            for (var n in equipmentTypes) {
                var type = self.getEquipmentType(equipmentTypes[n]);
                self._game.character.equipment[type] = item;
            }

            self._game.character.items.remove(item);
        }

        unequipItem = (item: IItem) => {
            var self = this;
            var equipmentTypes = Array.isArray(item.equipmentType) ? <EquipmentType[]>item.equipmentType : [<EquipmentType>item.equipmentType];

            for (var n in equipmentTypes) {
                var type = self.getEquipmentType(equipmentTypes[n]);
                self.unequip(type);
            }
        }

        isSlotUsed = (slot: string) => {
            var self = this;

            if (self._game.character) {
                return self._game.character.equipment[slot] !== undefined;
            }

            return false;
        }

        dropItem = (item: IItem): void => {
            var self = this;
            self._game.character.items.remove(item);
            self._game.currentLocation.items.push(item);
            self._scope.$emit('refreshCombine');
        }

        showQuests = (): boolean => {
            var self = this;
            return self._game.character && !isEmpty(self._game.character.quests);
        }

        showActiveQuests = (): boolean => {
            var self = this;
            return self._game.character.quests.filter(q => !q.completed).length > 0;
        }

        showCompletedQuests = (): boolean => {
            var self = this;
            return self._game.character.quests.filter(q => q.completed).length > 0;
        }

        questStatus = (quest: IQuest): string => {
            var self = this;
            return typeof quest.status === 'function' ? (<any>quest).status(self._game, quest, quest.checkDone(self._game, quest)) : quest.status;
        }

        private unequip(type: string, currentItem?: IItem) {
            var self = this;
            var equippedItem = self._game.character.equipment[type];

            if (equippedItem) {
                if (Array.isArray(equippedItem.equipmentType) && !currentItem) {
                    for (var n in equippedItem.equipmentType) {
                        var type = self.getEquipmentType(equippedItem.equipmentType[n]);
                        self.unequip(type, equippedItem);
                    }
                }

                if (self._rules.beforeUnequip) {
                    if (!self._rules.beforeUnequip(self._game, self._game.character, equippedItem)) {
                        return;
                    }
                }

                if (equippedItem.unequip) {
                    if (!equippedItem.unequip(equippedItem, self._game)) {
                        return;
                    }
                }

                if (equippedItem && equippedItem.equipmentType && self._game.character.items.indexOf(equippedItem) === -1) {
                    self._game.character.items.push(equippedItem);
                }

                self._game.character.equipment[type] = null;
            }
        }

        private getEquipmentType = (slot: StoryScript.EquipmentType) => {
            var type = StoryScript.EquipmentType[slot];
            return type.substring(0, 1).toLowerCase() + type.substring(1);
        }
    }

    CharacterSheetController.$inject = ['$scope', 'characterService', 'rules', 'game', 'customTexts'];
}