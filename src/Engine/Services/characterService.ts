import { IRules } from '../Interfaces/rules/rules';
import { IGame } from '../Interfaces/game';
import { ICharacter } from '../Interfaces/character';
import { IItem } from '../Interfaces/item';
import { IQuest } from '../Interfaces/quest';
import { ICharacterService } from '../Interfaces/services/characterService';
import { ICreateCharacter } from '../Interfaces/createCharacter/createCharacter';
import { ICreateCharacterAttribute } from '../Interfaces/createCharacter/createCharacterAttribute';
import { ICreateCharacterAttributeEntry } from '../Interfaces/createCharacter/createCharacterAttributeEntry';
import { ICreateCharacterStep } from '../Interfaces/createCharacter/createCharacterStep';
import { GameState } from '../Interfaces/enumerations/gameState';
import { EquipmentType } from '../Interfaces/enumerations/equipmentType';

export class CharacterService implements ICharacterService {
    constructor(private _game: IGame, private _rules: IRules) {
    }

    getSheetAttributes = (): string[] => this._rules.character.getSheetAttributes && this._rules.character.getSheetAttributes() || [];

    setupCharacter = (): ICreateCharacter => {
        var sheet = (this._rules.character.getCreateCharacterSheet && this._rules.character.getCreateCharacterSheet()) || { steps: []};
        this.prepareSheet(sheet);
        this._game.createCharacterSheet = sheet;
        return sheet;
    }

    limitSheetInput = (value: number, attribute: ICreateCharacterAttribute, entry: ICreateCharacterAttributeEntry): void => {
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

    distributionDone = (sheet: ICreateCharacter, step?: ICreateCharacterStep): boolean => {
        var done = true;

        if (step) {
            done = this.checkStep(step);
        }
        else {
            if (sheet && sheet.steps) {
                sheet.steps.forEach(step => {
                    done = this.checkStep(step);
                });
            }
        }

        return done;
    }

    createCharacter = (game: IGame, characterData: ICreateCharacter): ICharacter => {
        var character = null;

        if (this._rules.character.createCharacter) {

            character = this._rules.character.createCharacter(game, characterData);
            this.processDefaultSettings(character, characterData);
        }
        else {
            // Set a placeholder character to keep the game logic functional when no character is used.
            character = <any>{
                name: null
            };
        }

        return character;
    }

    setupLevelUp = (): ICreateCharacter => {
        var sheet = this._rules.character.getLevelUpSheet && this._rules.character.getLevelUpSheet();

        if (sheet) {
            this.prepareSheet(sheet);
            this._game.createCharacterSheet = sheet;
        }

        return sheet;
    }

    levelUp = (): ICharacter => {
        var character = this._game.character;
        var sheet = this._game.createCharacterSheet;

        if (this._rules.character.levelUp && this._rules.character.levelUp(character, sheet)) {
            this.processDefaultSettings(character, sheet);
        }

        this._game.state = GameState.Play;
        return character;
    }

    pickupItem = (item: IItem): boolean => {
        var isCombining = this._game.combinations && this._game.combinations.activeCombination;

        if (isCombining) {
            this._game.combinations.tryCombine(item)
            return false;
        }

        this._game.character.items.push(item);
        this._game.currentLocation.items.remove(item);
        return true;
    }

    canEquip = (item: IItem): boolean => item.equipmentType != EquipmentType.Miscellaneous;

    equipItem = (item: IItem): boolean => {
        var equipmentTypes = Array.isArray(item.equipmentType) ? <EquipmentType[]>item.equipmentType : [<EquipmentType>item.equipmentType];

        for (var n in equipmentTypes) {
            var type = this.getEquipmentType(equipmentTypes[n]);
            var unequipped = this.unequip(type);

            if (!unequipped) {
                return false;
            }
        }

        if (this._rules.character.beforeEquip) {
            if (!this._rules.character.beforeEquip(this._game, this._game.character, item)) {
                return false;
            }
        }

        if (item.equip) {
            if (!item.equip(item, this._game)) {
                return false;
            }
        }

        for (var n in equipmentTypes) {
            var type = this.getEquipmentType(equipmentTypes[n]);
            this._game.character.equipment[type] = item;
        }

        this._game.character.items.remove(item);
        return true;
    }

    unequipItem = (item: IItem): boolean => {
        var equipmentTypes = Array.isArray(item.equipmentType) ? <EquipmentType[]>item.equipmentType : [<EquipmentType>item.equipmentType];

        for (var n in equipmentTypes) {
            var type = this.getEquipmentType(equipmentTypes[n]);
            var unequipped = this.unequip(type);

            if (!unequipped) {
                return false;
            }
        }

        return true;
    }

    isSlotUsed = (slot: string): boolean => {
        if (this._game.character && this._game.character.equipment) {
            return this._game.character.equipment[slot] !== undefined;
        }

        return false;
    }

    dropItem = (item: IItem): void => {
        if (!item) {
            return;
        }

        var drop = true;

        if (this._rules.character.beforeDrop)
        {
            drop = this._rules.character.beforeDrop(this._game, this._game.character, item);
        }

        if (drop)
        {
            this._game.character.items.remove(item);
            this._game.currentLocation.items.push(item);
        }
    }

    questStatus = (quest: IQuest): string => typeof quest.status === 'function' ? (<any>quest).status(this._game, quest, quest.checkDone(this._game, quest)) : quest.status;

    private prepareSheet = (sheet: ICreateCharacter): void => {
        if (sheet.steps.length == 0) {
            return;
        }
        
        sheet.currentStep = 0;

        if (sheet.steps[0].questions && sheet.steps[0].questions[0].entries) {
            sheet.steps[0].questions[0].selectedEntry = sheet.steps[0].questions[0].entries[0];
        }

        this.setFinish(sheet);

        sheet.nextStep = (data: ICreateCharacter, next: Boolean) => {
            if (next !== undefined && next !== null && !next)
            {
                this.setFinish(data);
                return;
            }

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

    private checkStep = (step: ICreateCharacterStep): boolean => {
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
        if (!characterData.steps) {
            return;
        }

        characterData.steps.forEach(step => {
            if (step.questions) {
                step.questions.forEach(question => {
                    if (question.selectedEntry && character.hasOwnProperty(question.selectedEntry.value)) {
                        character[question.selectedEntry.value] += question.selectedEntry.bonus;
                    }
                });
            }
        });

        characterData.steps.forEach(step => {
            if (step.attributes) {
                step.attributes.forEach(attribute => {
                    attribute.entries.forEach(entry => {
                        if (character.hasOwnProperty(entry.attribute)) {
                            character[entry.attribute] = entry.value;
                        }
                    });
                });
            }
        }); 
    }

    private unequip = (type: string, currentItem?: IItem): boolean => {
        var equippedItem = this._game.character.equipment[type];

        if (equippedItem) {
            if (Array.isArray(equippedItem.equipmentType) && !currentItem) {
                for (var n in equippedItem.equipmentType) {
                    var type = this.getEquipmentType(equippedItem.equipmentType[n]);
                    var unEquipped = this.unequip(type, equippedItem);

                    if (!unEquipped) {
                        return false;
                    }
                }

                return true;
            }

            if (this._rules.character.beforeUnequip) {
                if (!this._rules.character.beforeUnequip(this._game, this._game.character, equippedItem)) {
                    return false;
                }
            }

            if (equippedItem.unequip) {
                if (!equippedItem.unequip(equippedItem, this._game)) {
                    return false;
                }
            }

            if (equippedItem && !isNaN(equippedItem.equipmentType) && !this._game.character.items.get(equippedItem)) {
                this._game.character.items.push(equippedItem);
            }

            this._game.character.equipment[type] = null;
        }

        return true;
    }

    private getEquipmentType = (slot: EquipmentType): string => {
        var type = EquipmentType[slot];
        return type.substring(0, 1).toLowerCase() + type.substring(1);
    }

    private setFinish = (data: ICreateCharacter): void => {
        if (data && data.steps) {
            var activeStep = data.steps[data.currentStep];

            if (activeStep.questions) {
                activeStep.finish = activeStep.questions.filter(q => q.selectedEntry.finish).length > 0;
            }
        }
    }
}