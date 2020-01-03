import { IRules, ICharacter, ICreateCharacter, ICombinationAction } from 'storyScript/Interfaces/storyScript';
import { IGame, IEnemy, Character } from './types';

export function Rules(): IRules {
    return {
        setup: {
            getCombinationActions: (): ICombinationAction[] => {
                return [
                    // Add combination action names here if you want to use this feature.
                ];
            }
        },

        general: {  
            scoreChange: (game: IGame, change: number): boolean => {
                // Implement logic to occur when the score changes. Return true when the character gains a level.
                return false;
            }
        },
        
        character: {
            getSheetAttributes: (): string[] => {
                return [
                    'currency',
                    'strength',
                    'melee',
                    'armor',
                    'agility',
                    'ranged',
                    'stealth',
                    'intelligence',
                    'creation',
                    'destruction',
                    'charisma',
                    'body',
                    'spirit'
                ];
            },

            getCreateCharacterSheet: (): ICreateCharacter => {
                return {
                    steps: [
                        {
                            questions: [
                                {
                                    question: 'Do you want to start play...',
                                    entries: [
                                        {
                                            text: 'Right away',
                                            value: '1'
                                        },
                                        {
                                            text: 'After telling your story',
                                            value: '2'
                                        },
                                        {
                                            text: 'By fine-tuning your sheet',
                                            value: '3'
                                        }
                                    ]
                                }
                            ],
                            nextStepSelector: (character, currentStep) => {
                                switch (currentStep.questions[0].selectedEntry.value) {
                                    case '1': {
                                        return 1;
                                    };
                                    case '2': {
                                        return 2;
                                    };
                                    case '3': {
                                        return 3;
                                    };
                                    default: {
                                        return 0;
                                    }
                                }
                            }
                        },
                        {
                            questions: [
                                {
                                    question: 'Select your hero',
                                    entries: [
                                        {
                                            text: 'Barlon the Oak',
                                            value: 'barlon',
                                            bonus: 1
                                        },
                                        {
                                            text: 'Stella the Quick',
                                            value: 'stella',
                                            bonus: 1
                                        },
                                        {
                                            text: 'Jane Orion',
                                            value: 'jane',
                                            bonus: 1
                                        },
                                        {
                                            text: 'Marlin Peacemaker',
                                            value: 'marlin',
                                            bonus: 1
                                        }
                                    ]
                                }
                            ],
                            nextStepSelector: 5
                        },
                        {
                            questions: [
                                {
                                    question: 'As a child, you were always...',
                                    entries: [
                                        {
                                            text: 'strong in fights',
                                            value: 'strength',
                                            bonus: 1
                                        },
                                        {
                                            text: 'a fast runner',
                                            value: 'agility',
                                            bonus: 1
                                        },
                                        {
                                            text: 'a curious reader',
                                            value: 'intelligence',
                                            bonus: 1
                                        }
                                    ]
                                }
                            ],
                            nextStepSelector: 5
                        },
                        {
                            attributes: [
                                {
                                    question: 'Distribute your points...',
                                    numberOfPointsToDistribute: 10,
                                    entries: [
                                        {
                                            attribute: 'strength',
                                            max: 5,
                                            min: 1
                                        },
                                        {
                                            attribute: 'agility',
                                            max: 5,
                                            min: 1
                                        },
                                        {
                                            attribute: 'intelligence',
                                            max: 5,
                                            min: 1
                                        },
                                        {
                                            attribute: 'charisma',
                                            max: 5,
                                            min: 1
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            attributes: [
                                {
                                    question: 'Strength skills',
                                    numberOfPointsToDistribute: 10,
                                    entries: [
                                        {
                                            attribute: 'melee',
                                            max: 5,
                                            min: 0
                                        },
                                        {
                                            attribute: 'armor',
                                            max: 5,
                                            min: 0
                                        }
                                    ]
                                },
                                {
                                    question: 'Agility skills',
                                    numberOfPointsToDistribute: 10,
                                    entries: [
                                        {
                                            attribute: 'ranged',
                                            max: 5,
                                            min: 0
                                        },
                                        {
                                            attribute: 'stealth',
                                            max: 5,
                                            min: 0
                                        }
                                    ]
                                },
                                {
                                    question: 'Intelligence skills',
                                    numberOfPointsToDistribute: 10,
                                    entries: [
                                        {
                                            attribute: 'creation',
                                            max: 5,
                                            min: 0
                                        },
                                        {
                                            attribute: 'destruction',
                                            max: 5,
                                            min: 0
                                        }
                                    ]
                                },
                                {
                                    question: 'Charisma skills',
                                    numberOfPointsToDistribute: 10,
                                    entries: [
                                        {
                                            attribute: 'body',
                                            max: 5,
                                            min: 0
                                        },
                                        {
                                            attribute: 'spirit',
                                            max: 5,
                                            min: 0
                                        }
                                    ]
                                }
                            ],
                            numberOfAttributePoints: 10,
                            initStep: (character, previousStep) => {
                                character.steps[previousStep].attributes[0].entries.forEach((ep, i) => {
                                    character.steps[previousStep + 1].attributes[i].entries.forEach(ec => {
                                        ec.value = 0;
                                        ec.max = <number>ep.value;
                                    });
                                });
                            }
                        },
                        {
                            questions: [
                                {
                                    question: 'Select your weapon...',
                                    entries: [
                                    ]
                                }
                            ]
                        }
                    ]
                };
            },

            createCharacter: (game: IGame, characterData: ICreateCharacter): ICharacter => {
                var character = new Character();
                return character;
            }
        },

        exploration: {
            
        },

        combat: {     
            fight: (game: IGame, enemy: IEnemy, retaliate?: boolean) => {
                retaliate = retaliate == undefined ? true : retaliate;

                // Implement character attack here.

                if (retaliate) {
                    game.currentLocation.activeEnemies.filter((enemy: IEnemy) => { return enemy.hitpoints > 0; }).forEach(enemy => {
                        // Implement monster attack here
                    });
                }
            }
        }
    };
}