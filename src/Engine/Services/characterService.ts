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

    getSheetAttributes = (): string[] => this._rules.character.getSheetAttributes?.() || [];

    setupCharacter = (): ICreateCharacter => {
        const sheet = (this._rules.character.getCreateCharacterSheet?.()) || { steps: []};
        this.prepareSheet(sheet);
        this._game.createCharacterSheet = sheet;
        return sheet;
    }

    limitSheetInput = (value: number, attribute: ICreateCharacterAttribute, entry: ICreateCharacterAttributeEntry): void => {
        if (!isNaN(value)) {
            let totalAssigned = 0;

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
        let done = true;

        if (step) {
            done = this.checkStep(step);
        }
        else if (sheet?.steps) {
            sheet.steps.forEach(step => {
                done = this.checkStep(step);
            });
        }

        return done;
    }

    createCharacter = (game: IGame, characterData: ICreateCharacter): ICharacter => {
        let character: ICharacter = null;

        if (this._rules.character.createCharacter) {

            character = this._rules.character.createCharacter(game, characterData);
            character.currentHitpoints = character.hitpoints;
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
        const sheet = this._rules.character.getLevelUpSheet?.();

        if (sheet) {
            this.prepareSheet(sheet);
            this._game.createCharacterSheet = sheet;
        }

        return sheet;
    }

    levelUp = (character: ICharacter): ICharacter => {
        var sheet = this._game.createCharacterSheet;

        if (this._rules.character.levelUp && this._rules.character.levelUp(character, sheet)) {
            this.processDefaultSettings(character, sheet);
        }

        this._game.state = GameState.Play;
        return character;
    }

    pickupItem = (character: ICharacter, item: IItem): boolean => {
        var isCombining = this._game.combinations && this._game.combinations.activeCombination;

        if (isCombining) {
            this._game.combinations.tryCombine(item)
            return false;
        }

        if (this._rules.character.beforePickup && !this._rules.character.beforePickup(this._game, character, item)) {
            return false;
        }

        this._game.currentLocation.items.delete(item);
        character.items.add(item);

        return true;
    }

    isEquippable = (item: IItem): boolean => item.equipmentType != EquipmentType.Miscellaneous;

    canDrop = (item: IItem): boolean => typeof item.canDrop === 'function' ? 
                                            item.canDrop(this._game, item) : typeof item.canDrop === 'undefined' ? 
                                            true : item.canDrop;

    equipItem = (character: ICharacter, item: IItem): boolean => {
        var equipmentTypes = Array.isArray(item.equipmentType) ? <EquipmentType[]>item.equipmentType : [<EquipmentType>item.equipmentType];

        for (var n in equipmentTypes) {
            var type = this.getEquipmentType(equipmentTypes[n]);
            var unequipped = this.unequip(character, type);

            if (!unequipped) {
                return false;
            }
        }

        if (this._rules.character.beforeEquip) {
            if (!this._rules.character.beforeEquip(this._game, character, item)) {
                return false;
            }
        }

        if (item.equip) {
            if (!item.equip(character, item, this._game)) {
                return false;
            }
        }

        for (var n in equipmentTypes) {
            var type = this.getEquipmentType(equipmentTypes[n]);
            character.equipment[type] = item;
        }

        character.items.splice(character.items.indexOf(item), 1);
        return true;
    }

    unequipItem = (character: ICharacter, item: IItem): boolean => {
        var equipmentTypes = Array.isArray(item.equipmentType) ? <EquipmentType[]>item.equipmentType : [<EquipmentType>item.equipmentType];

        for (var n in equipmentTypes) {
            var type = this.getEquipmentType(equipmentTypes[n]);
            var unequipped = this.unequip(character, type);

            if (!unequipped) {
                return false;
            }
        }

        return true;
    }

    isSlotUsed = (character: ICharacter, slot: string): boolean => {
        if (character && character.equipment) {
            return character.equipment[slot] !== undefined;
        }

        return false;
    }

    dropItem = (character: ICharacter, item: IItem): void => {
        if (!item) {
            return;
        }

        var drop = true;

        if (this._rules.character.beforeDrop)
        {
            drop = this._rules.character.beforeDrop(this._game, character, item);
        }

        if (drop)
        {
            character.items.delete(item);
            this._game.currentLocation.items.add(item);
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

        if (sheet.steps[0].initStep) {
            sheet.steps[0].initStep(this._game.party, sheet, sheet.steps[0], undefined);
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
                var nextStep = typeof selector === 'function' ? (<any>selector)(this._game.party, data, data.steps[data.currentStep]) : selector;
                data.currentStep = nextStep;
            }
            else {
                data.currentStep++;
            }

            var currentStep = data.steps[data.currentStep];

            if (currentStep.initStep) {
                currentStep.initStep(this._game.party, data, currentStep, previousStep);
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
            let totalAssignedAll = 0;

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
                        totalAssigned += <number>entry.value || 0;
                    }
                });

                totalAssignedAll += totalAssigned;
                done = totalAssigned === attr.numberOfPointsToDistribute || textChoicesFilled === attr.entries.length;
            });

            if (step.numberOfAttributePoints) {
                done = totalAssignedAll === step.numberOfAttributePoints;
            }
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

    private unequip = (character: ICharacter, type: string, currentItem?: IItem): boolean => {
        var equippedItem = <IItem>character.equipment[type];

        if (equippedItem) {
            if (Array.isArray(equippedItem.equipmentType) && !currentItem) {
                for (var n in equippedItem.equipmentType) {
                    var type = this.getEquipmentType(equippedItem.equipmentType[n]);
                    var unEquipped = this.unequip(character, type, equippedItem);

                    if (!unEquipped) {
                        return false;
                    }
                }

                return true;
            }

            if (this._rules.character.beforeUnequip) {
                if (!this._rules.character.beforeUnequip(this._game, character, equippedItem)) {
                    return false;
                }
            }

            if (equippedItem.unequip) {
                if (!equippedItem.unequip(character, equippedItem, this._game)) {
                    return false;
                }
            }

            if (equippedItem && equippedItem.equipmentType && character.items.indexOf(equippedItem) < 0) {
                character.items.push(equippedItem);
            }

            character.equipment[type] = null;
        }

        return true;
    }

    private getEquipmentType = (slot: EquipmentType | string): string => {
        var type = EquipmentType[slot] ?? slot;
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