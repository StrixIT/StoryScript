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
import {EquipmentType} from '../Interfaces/enumerations/equipmentType';
import {compareString, getEquipmentType} from '../utilityFunctions';
import {IEnemy} from "storyScript/Interfaces/enemy.ts";
import {removeItemFromItemsAndEquipment} from "storyScript/Services/sharedFunctions.ts";
import {IDataService} from "storyScript/Interfaces/services/dataService.ts";

export class CharacterService implements ICharacterService {
    constructor(private _dataService: IDataService, private _game: IGame, private _rules: IRules) {
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

    pickupItem = (character: ICharacter, item: IItem): boolean => {
        const isCombining = this._game.combinations?.activeCombination;

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

    canDrop = (item: IItem): boolean => {
        let canDrop: boolean;

        if (typeof item.canDrop === 'function') {
            canDrop = item.canDrop(this._game, item);
        } else if (typeof item.canDrop === 'undefined') {
            canDrop = true;
        } else {
            canDrop = item.canDrop;
        }

        return canDrop
    };

    equipItem = (character: ICharacter, item: IItem): boolean => {
        const equipmentTypes = Array.isArray(item.equipmentType) ? <EquipmentType[]>item.equipmentType : [<EquipmentType>item.equipmentType];

        const slotsAvailable = this.makeSlotAvailable(character, item, equipmentTypes);

        if (slotsAvailable.length === 0) {
            return false;
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

        for (const n in slotsAvailable) {
            character.equipment[slotsAvailable[n]] = item;
        }

        character.items.splice(character.items.indexOf(item), 1);
        return true;
    }

    unequipItem = (character: ICharacter, item: IItem): boolean => {
        return this.unequip(character, item);
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

    dropItem = (character: ICharacter, item: IItem): void => {
        if (!item) {
            return;
        }

        let drop = true;

        if (this._rules.character.beforeDrop) {
            drop = this._rules.character.beforeDrop(this._game, character, item);
        }

        if (drop) {
            character.items.delete(item);
            this._game.currentLocation.items.add(item);
        }
    }

    useItem = (character: ICharacter, item: IItem, target?: IEnemy): Promise<void> | void => {
        const useItem = (this._rules.exploration?.onUseItem?.(this._game, character, item) && item.use) ?? item.use;

        if (useItem) {
            const promise = item.use(this._game, character, item, target);

            return Promise.resolve(promise).then(() => {
                if (item.charges !== undefined) {
                    if (!isNaN(item.charges)) {
                        item.charges--;
                    }

                    if (item.charges <= 0) {
                        removeItemFromItemsAndEquipment(character, item);
                    }
                }
            });
        }
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
                            
                            if (slotItem !== item) {
                                // When restoring data, a single item occupying multiple slots will be duplicated,
                                // so each slot contains a separate item of the same kind. Remove the duplicates here.
                                if (slotItem.id === item.id) {
                                    c.equipment[slot] = item;
                                } else {
                                    valid = false;
                                }
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

    private prepareSheet = (sheet: ICreateCharacter): void => {
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

    private checkStep = (step: ICreateCharacterStep): boolean => {
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

    private makeSlotAvailable(character: ICharacter, item: IItem, equipmentTypes: EquipmentType[]): string[] {
        if (!item.usesMultipleSlots) {
            return this.findAvailableSlot(character, equipmentTypes);
        }

        const availableSlots: string[] = [];

        for (const n in equipmentTypes) {
            const type = getEquipmentType(equipmentTypes[n]);
            const slotItem = character.equipment[type];

            if (slotItem) {
                const unequipped = this.unequip(character, slotItem);

                if (!unequipped) {
                    return [];
                }
            }

            availableSlots.push(type);
        }

        return availableSlots;
    }

    private findAvailableSlot(character: ICharacter, equipmentTypes: EquipmentType[]) {
        // If the item uses only one of the slots specified, see if a slot is available first.
        const occupiedSlots: string[] = [];
        const emptySlots: string[] = [];

        for (const n in equipmentTypes) {
            const type = getEquipmentType(equipmentTypes[n]);

            if (character.equipment[type]) {
                occupiedSlots.push(type);
            } else {
                emptySlots.push(type);
            }
        }

        if (emptySlots.length === 0) {
            const slotToUnequip = occupiedSlots[occupiedSlots.length - 1];
            const unequipped = this.unequip(character, character.equipment[slotToUnequip]);
            return !unequipped ? [] : [slotToUnequip];
        }

        return [emptySlots[0]];
    }

    private unequip = (character: ICharacter, equippedItem: IItem): boolean => {
        if (!equippedItem) {
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

        if (equippedItem?.equipmentType && character.items.indexOf(equippedItem) < 0) {
            character.items.push(equippedItem);
        }

        const slotsToUnEquip = Array.isArray(equippedItem.equipmentType)
            ? equippedItem.equipmentType
            : [equippedItem.equipmentType];

        slotsToUnEquip.forEach(t => {
            const itemType = getEquipmentType(t);
            const slotItem = character.equipment[itemType];
            character.equipment[itemType] = slotItem === equippedItem ? null : slotItem;
        });

        return true;
    }

    private setFinish = (data: ICreateCharacter): void => {
        if (data?.steps) {
            const activeStep = data.steps[data.currentStep];

            if (activeStep.questions) {
                activeStep.finish = activeStep.questions.filter(q => q.selectedEntry.finish).length > 0;
            }
        }
    }
}