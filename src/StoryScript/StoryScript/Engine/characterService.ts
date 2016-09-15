module StoryScript {
    export interface ICharacterService {
        getSheetAttributes(): string[];
        createCharacter(characterData: any): ICharacter;
        canEquip(item: IItem): boolean;
        equipItem(item: IItem): void;
        unequipItem(item: IItem): void;
        isSlotUsed(slot: string): boolean;
        dropItem(item: IItem): void;
        useItem(item: IItem): void;
    }
}

module StoryScript {
    export class CharacterService implements ng.IServiceProvider, ICharacterService {
        private dataService: IDataService;
        private ruleService: IRuleService;
        private game: IGame

        constructor(dataService: IDataService, ruleService: IRuleService, game: IGame) {
            var self = this;
            self.dataService = dataService;
            self.ruleService = ruleService;
            self.game = game;
        }

        public $get(dataService: IDataService, ruleService: IRuleService): ICharacterService {
            var self = this;
            self.dataService = dataService;
            self.ruleService = ruleService;

            return {
                getSheetAttributes: self.getSheetAttributes,
                createCharacter: self.createCharacter,
                canEquip: self.canEquip,
                equipItem: self.equipItem,
                unequipItem: self.unequipItem,
                isSlotUsed: self.isSlotUsed,
                dropItem: self.dropItem,
                useItem: self.useItem
            };
        }

        getSheetAttributes = (): string[] => {
            var self = this;
            return self.ruleService.getSheetAttributes();
        }

        createCharacter = (characterData: ICreateCharacter): ICharacter => {
            var self = this;
            var character = self.dataService.load<ICharacter>(StoryScript.DataKeys.CHARACTER);

            if (isEmpty(character)) {

                var self = this;
                character = self.ruleService.createCharacter(characterData);

                characterData.steps.forEach(function (step) {
                    if (step.questions) {
                        step.questions.forEach(function (question) {
                            if (character.hasOwnProperty(question.selectedEntry.value)) {
                                character[question.selectedEntry.value] += question.selectedEntry.bonus;
                            }
                        });
                    }
                });

                characterData.steps.forEach(function (step) {
                    if (step.attributes) {
                        step.attributes.forEach(function (attribute) {
                            attribute.entries.forEach(function (entry) {
                                if (character.hasOwnProperty(entry.attribute)) {
                                    character[entry.attribute] = entry.value;
                                }
                            });
                        });
                    }
                });

                return character; 
            }

            if (isEmpty(character.items)) {
                character.items = [];
            }

            return character;
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

    CharacterService.$inject = ['dataService', 'ruleService', 'game'];
}