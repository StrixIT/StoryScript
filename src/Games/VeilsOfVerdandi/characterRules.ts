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
import {Dagger} from "./items/Dagger.ts";

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

        if (characterClass.name === ClassType.Rogue) {
            const dagger = Dagger();
            const secondDagger = Dagger();
            secondDagger['ss_added'] = true;
            dagger.members = [secondDagger];
            character.equipment['primaryWeapon'] = dagger;
            characterClass.inventory = characterClass.inventory.filter((i: any) => i.id !== 'dagger');
        }

        characterClass.inventory.forEach(i => {
            const item = i();
            const types = Array.isArray(item.equipmentType) ? item.equipmentType : [item.equipmentType];
            let equipped = false;
            
            for (const t in types) {
                const type = getEquipmentType(types[t]);
    
                if (Object.keys(character.equipment).find(k => k === type) && !character.equipment[type]) {
                    character.equipment[type] = item;
                    equipped = true;
                    break;
                }
            }
            
            if (!equipped) {
                character.items.push(item);
            }
        });

        character.class = characterClass;
        character.portraitFileName = characterClass.picture;
        return character;
    },
    
    isSlotUsed(character: Character, slot) {
        if (slot === 'bow') {
            return character.class.name === ClassType.Rogue;
        }
        else if (slot === 'special' || slot === 'secondaryWeapon') {
            return character.class.name !== ClassType.Wizard;
        }
        else if (slot === 'rightRing') {
            return character.class.name === ClassType.Wizard;
        }
        
        return true;
    },
}