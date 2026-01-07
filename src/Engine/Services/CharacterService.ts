import {IRules} from '../Interfaces/rules/rules';
import {IGame} from '../Interfaces/game';
import {ICharacter} from '../Interfaces/character';
import {IItem} from '../Interfaces/item';
import {IQuest} from '../Interfaces/quest';
import {ICharacterService} from '../Interfaces/services/characterService';
import {ICreateCharacter} from '../Interfaces/createCharacter/createCharacter';
import {ICreateCharacterAttribute} from '../Interfaces/createCharacter/createCharacterAttribute';
import {ICreateCharacterAttributeEntry} from '../Interfaces/createCharacter/createCharacterAttributeEntry';
import {ICreateCharacterStep} from '../Interfaces/createCharacter/createCharacterStep';
import {GameState} from '../Interfaces/enumerations/gameState';
import {getEquipmentType} from '../utilityFunctions';
import {IDataService} from "storyScript/Interfaces/services/dataService.ts";

export class CharacterService implements ICharacterService {
    constructor(private readonly _dataService: IDataService, private readonly _game: IGame, private readonly _rules: IRules) {
    }

    getSheetAttributes = (): string[] => this._rules.character.getSheetAttributes?.() || [];

    setupCharacter = (): ICreateCharacter => {
        const sheet = (this._rules.character.getCreateCharacterSheet?.()) || {steps: []};
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
            } else if (entry.value < entry.min) {
                entry.value = entry.min;
            }
        } else {
            entry.value = entry.min;
        }
    }

    distributionDone = (sheet: ICreateCharacter, step?: ICreateCharacterStep): boolean => {
        let done = true;

        if (step) {
            done = this.checkStep(step);
        } else if (sheet?.steps) {
            sheet.steps.forEach(step => {
                done = this.checkStep(step);
            });
        }

        return done;
    }

    createCharacter = (game: IGame, characterData: ICreateCharacter): ICharacter => {
        let character: ICharacter;

        if (this._rules.character.createCharacter) {

            character = this._rules.character.createCharacter(game, characterData);
            character.currentHitpoints = character.hitpoints;
            this.processDefaultSettings(character, characterData);
        } else {
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
        const sheet = this._game.createCharacterSheet;

        if (this._rules.character.levelUp?.(character, sheet)) {
            this.processDefaultSettings(character, sheet);
            this._dataService.saveGame(this._game);
        }

        this._game.state = GameState.Play;
        return character;
    }

    isSlotUsed = (character: ICharacter, slot: string): boolean => {
        if (character?.equipment) {
            if (character.equipment[slot] === undefined) {
                return false;
            }

            return this._rules.character?.isSlotUsed ? this._rules.character.isSlotUsed(character, slot) : true;
        }

        return false;
    }

    questStatus = (quest: IQuest): string => typeof quest.status === 'function' ? (<any>quest).status(this._game, quest, quest.checkDone(this._game, quest)) : quest.status;

    checkEquipment = (): void => {
        this._game.party.characters.forEach(c => {
            if (c.equipment) {
                Object.keys(c.equipment).forEach(k => {
                    const item = <IItem>c.equipment[k];

                    if (!item?.equipmentType) {
                        return;
                    }
                    
                    const itemType = Array.isArray(item.equipmentType) ? item.equipmentType : [item.equipmentType];
                    let valid = true;
                    
                    if (!item.usesMultipleSlots)
                    {
                        valid = itemType.find(t => getEquipmentType(t) === k) !== undefined;
                    }
                    else {
                        for (const i in itemType) {
                            const slot = getEquipmentType(itemType[i]);
                            const slotItem = c.equipment[slot];
                            
                            if (slotItem && (slotItem === item || slotItem.id === item.id)) {
                                // When restoring data, a single item occupying multiple slots will be duplicated,
                                // so each slot contains a separate item of the same kind. Remove the duplicates here.
                                    c.equipment[slot] = item;
                            } else {
                                valid = false;
                            }
                        }
                    }
                    
                    if (!valid) {
                        c.equipment[k] = null;
                        c.items.push(item);
                    }
                });
            }
        })
    }

    private readonly prepareSheet = (sheet: ICreateCharacter): void => {
        if (sheet.steps.length == 0) {
            return;
        }

        sheet.currentStep = 0;

        if (sheet.steps[0].questions?.[0]?.entries.length > 0) {
            sheet.steps[0].questions[0].selectedEntry = sheet.steps[0].questions[0].entries[0];
        }

        if (sheet.steps[0].initStep) {
            sheet.steps[0].initStep(this._game.party, sheet, sheet.steps[0], undefined);
        }

        this.setFinish(sheet);

        sheet.nextStep = (data: ICreateCharacter, next: boolean) => {
            if (next !== undefined && next !== null && !next) {
                this.setFinish(data);
                return;
            }

            const selector = data.steps[data.currentStep].nextStepSelector;
            const previousStep = data.currentStep;

            if (selector) {
                data.currentStep = typeof selector === 'function' ? (<any>selector)(this._game.party, data, data.steps[data.currentStep]) : selector;
            } else {
                data.currentStep++;
            }

            const currentStep = data.steps[data.currentStep];

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
                    if (question.entries?.length) {
                        question.selectedEntry = question.entries[0];
                    }
                });
            }
        };
    }

    private readonly checkStep = (step: ICreateCharacterStep): boolean => {
        let done = true;

        if (step.attributes) {
            let totalAssignedAll = 0;

            step.attributes.forEach(attr => {
                let totalAssigned = 0;
                let textChoicesFilled = 0;

                attr.entries.forEach((entry) => {
                    if (!entry.max) {
                        if (entry.value) {
                            textChoicesFilled += 1;
                        }
                    } else {
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

    private readonly processDefaultSettings = (character: ICharacter, characterData: ICreateCharacter): void => {
        if (!characterData.steps) {
            return;
        }

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

        characterData.steps.forEach(step => {
            if (step.questions) {
                step.questions.forEach(question => {
                    if (question.selectedEntry && character.hasOwnProperty(question.selectedEntry.value)) {
                        character[question.selectedEntry.value] += question.selectedEntry.bonus;
                    }
                });
            }
        });
    }

    private readonly setFinish = (data: ICreateCharacter): void => {
        if (data?.steps) {
            const activeStep = data.steps[data.currentStep];

            if (activeStep.questions) {
                activeStep.finish = activeStep.questions.filter(q => q.selectedEntry.finish).length > 0;
            }
        }
    }
}