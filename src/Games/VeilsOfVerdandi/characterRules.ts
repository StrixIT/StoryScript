import {ICreateCharacter} from "storyScript/Interfaces/createCharacter/createCharacter.ts";
import {ClassType} from "./classType.ts";
import {IParty} from "./interfaces/party.ts";
import {ICreateCharacterStep} from "storyScript/Interfaces/createCharacter/createCharacterStep.ts";
import {IGame} from "./interfaces/game.ts";
import {ICharacter} from "storyScript/Interfaces/character.ts";
import {Character} from "./character.ts";
import {CharacterClasses} from "./characterClass.ts";
import {getEquipmentType} from "storyScript/utilityFunctions.ts";
import {ICharacterRules} from "storyScript/Interfaces/rules/characterRules.ts";

export const characterRules = <ICharacterRules>{
    getCreateCharacterSheet: (): ICreateCharacter => {
        return {
            steps: [
                {
                    attributes: [
                        {
                            question: 'What is your name?',
                            entries: [
                                {
                                    attribute: 'name'
                                }
                            ]
                        }
                    ]
                },
                {
                    questions: [
                        {
                            question: 'Choose your class',
                            entries: [
                                {
                                    text: 'Rogue',
                                    value: ClassType.Rogue
                                },
                                {
                                    text: 'Warrior',
                                    value: ClassType.Warrior
                                },
                                {
                                    text: 'Wizard',
                                    value: ClassType.Wizard
                                }
                            ]
                        }
                    ],
                    initStep: (party: IParty, character: ICreateCharacter, currentStep: ICreateCharacterStep, previousStep: number) => {
                        if (party?.characters) {
                            currentStep.questions[0].entries = currentStep.questions[0].entries.filter(e => !party.characters.find(c => c.class.name === e.value));
                            currentStep.questions[0].selectedEntry = currentStep.questions[0].entries[0];
                        }
                    }
                },
            ]
        };
    },

    createCharacter: (game: IGame, characterData: ICreateCharacter): ICharacter => {
        const character = new Character();
        const selectedClass = characterData.steps[1].questions[0].selectedEntry.value;
        const characterClass = CharacterClasses[selectedClass];
        character.hitpoints = characterClass.hitpoints;

        characterClass.inventory.forEach(i => {
            const item = i();
            const type = getEquipmentType(<string>item.equipmentType);

            if (Object.keys(character.equipment).find(k => k === type) && !character.equipment[type]
            ) {
                character.equipment[type] = item;
            } else {
                character.items.push(item);
            }
        });

        character.class = characterClass;
        character.portraitFileName = characterClass.picture;
        return character;
    },
    
    isSlotUsed(character: Character, slot) {
        return !(slot === 'bow' && character.class.name !== ClassType.Rogue);
    },
}