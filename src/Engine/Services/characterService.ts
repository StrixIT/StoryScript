﻿namespace StoryScript {
    export interface ICharacterService {
        getSheetAttributes(): string[];
        setupCharacter(): ICreateCharacter;
        setupLevelUp(): ICreateCharacter;
        createCharacter(game: IGame, characterData: any): ICharacter;
        levelUp(game: IGame, characterData: any): ICharacter;
        limitSheetInput(value: number, attribute: ICreateCharacterAttribute, entry: ICreateCharacterAttributeEntry): void;
        distributionDone(sheet: ICreateCharacter, step: ICreateCharacterStep): boolean;
        canEquip(item: IItem): boolean;
        equipItem(item: IItem): void;
        unequipItem(item: IItem): void;
        isSlotUsed(slot: string): boolean;
        dropItem(item: IItem): void;
        questStatus(quest: IQuest): string;
    }
}

namespace StoryScript {
    export class CharacterService implements ICharacterService {
        constructor(private _dataService: IDataService, private _game: IGame, private _rules: IRules) {
        }

        getSheetAttributes = (): string[] => {
            var self = this;
            return self._rules.getSheetAttributes();
        }

        setupCharacter = (): ICreateCharacter => {
            var self = this;
            var sheet = self._rules.getCreateCharacterSheet();
            self.prepareSheet(sheet);
            self._game.createCharacterSheet = sheet;

            if (sheet.steps.length === 0) {
                self._game.character = self.createCharacter(self._game, sheet);
                self._game.changeLocation('Start');
                self._game.state = GameState.Play;
            }

            return sheet;
        }

        limitSheetInput = (value: number, attribute: ICreateCharacterAttribute, entry: ICreateCharacterAttributeEntry): void => {
            var self = this;

            if (!isNaN(value)) {
                var totalAssigned = 0;

                attribute.entries.forEach((innerEntry, index) => {
                    if (index !== attribute.entries.indexOf(entry)) {
                        totalAssigned += <number>innerEntry.value || 1;
                    }
                });

                if (totalAssigned + value > attribute.numberOfPointsToDistribute) {
                    value = attribute.numberOfPointsToDistribute - totalAssigned;
                }

                entry.value = value;

                if (entry.value > entry.max) {
                    entry.value = entry.max;
                }
                else if (entry.value < entry.min) {
                    entry.value = entry.min;
                }
            }
            else {
                entry.value = entry.min;
            }
        }

        distributionDone = (sheet: ICreateCharacter, step: ICreateCharacterStep): boolean => {
            var self = this;
            var done = true;

            if (step) {
                done = self.checkStep(step);
            }
            else {
                if (sheet && sheet.steps) {
                    sheet.steps.forEach(step => {
                        done = self.checkStep(step);
                    });
                }
            }

            return done;
        }

        createCharacter = (game: IGame, characterData: ICreateCharacter): ICharacter => {
            var self = this;
            var character = self._dataService.load<ICharacter>(StoryScript.DataKeys.CHARACTER);

            if (isEmpty(character)) {

                character = self._rules.createCharacter(game, characterData);
                self.processDefaultSettings(character, characterData);
            }

            return character;
        }

        setupLevelUp = (): ICreateCharacter => {
            var self = this;
            var sheet = self._rules.getLevelUpSheet();
            self.prepareSheet(sheet);
            self._game.createCharacterSheet = sheet;
            return sheet;
        }

        levelUp = (game: IGame, characterData: ICreateCharacter): ICharacter => {
            var self = this;
            var character = self._game.character;

            if (self._rules.levelUp(character, characterData)) {
                self.processDefaultSettings(character, characterData);
            }

            game.state = StoryScript.GameState.Play;
            return character;
        }

        canEquip = (item: IItem): boolean => {
            return item.equipmentType != StoryScript.EquipmentType.Miscellaneous;
        }

        equipItem = (item: IItem): void => {
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

        unequipItem = (item: IItem): void => {
            var self = this;
            var equipmentTypes = Array.isArray(item.equipmentType) ? <EquipmentType[]>item.equipmentType : [<EquipmentType>item.equipmentType];

            for (var n in equipmentTypes) {
                var type = self.getEquipmentType(equipmentTypes[n]);
                self.unequip(type);
            }
        }

        isSlotUsed = (slot: string): boolean => {
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
        }

        questStatus = (quest: IQuest): string => {
            var self = this;
            return typeof quest.status === 'function' ? (<any>quest).status(self._game, quest, quest.checkDone(self._game, quest)) : quest.status;
        }

        private prepareSheet = (sheet: ICreateCharacter): void => {
            if (sheet.steps.length == 0) {
                return;
            }
            
            sheet.currentStep = 0;

            if (sheet.steps[0].questions && sheet.steps[0].questions[0].entries) {
                sheet.steps[0].questions[0].selectedEntry = sheet.steps[0].questions[0].entries[0];
            }

            sheet.nextStep = (data: ICreateCharacter) => {
                var selector = data.steps[data.currentStep].nextStepSelector;
                var previousStep = data.currentStep;

                if (selector) {
                    var nextStep = typeof selector === 'function' ? (<any>selector)(data, data.steps[data.currentStep]) : selector;
                    data.currentStep = nextStep;
                }
                else {
                    data.currentStep++;
                }

                var currentStep = data.steps[data.currentStep];

                if (currentStep.initStep) {
                    currentStep.initStep(data, previousStep, currentStep);
                }

                if (currentStep.attributes) {
                    currentStep.attributes.forEach(attr => {
                        attr.entries.forEach(entry => {
                            if (entry.min) {
                                entry.value = entry.min;
                            }
                        });
                    });
                }

                if (currentStep.questions) {
                    currentStep.questions.forEach(question => {
                        if (question.entries && question.entries.length) {
                            question.selectedEntry = question.entries[0];
                        }
                    });
                }
            };
        }

        private checkStep(step: ICreateCharacterStep) {
            var done = true;

            if (step.attributes) {
                step.attributes.forEach(attr => {
                    var totalAssigned = 0;
                    var textChoicesFilled = 0;

                    attr.entries.forEach((entry) => {
                        if (!entry.max) {
                            if (entry.value) {
                                textChoicesFilled += 1;
                            }
                        }
                        else {
                            totalAssigned += <number>entry.value || 1;
                        }
                    });

                    done = totalAssigned === attr.numberOfPointsToDistribute || textChoicesFilled === attr.entries.length;
                });
            }

            return done;
        }

        private processDefaultSettings = (character: ICharacter, characterData: ICreateCharacter): void => {
            characterData.steps.forEach(function (step) {
                if (step.questions) {
                    step.questions.forEach(function (question) {
                        if (question.selectedEntry && character.hasOwnProperty(question.selectedEntry.value)) {
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

                if (equippedItem && !isNaN( equippedItem.equipmentType) && self._game.character.items.indexOf(equippedItem) === -1) {
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
}