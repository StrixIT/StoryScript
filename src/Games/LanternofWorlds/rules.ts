namespace LanternofWorlds {
    export function Rules(): StoryScript.IRules {
        return {
            setup: {
                getCombinationActions: (): StoryScript.ICombinationAction[] => {
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
                        // Add the character attributes that you want to show on the character sheet here
                    ];
                },

                getCreateCharacterSheet: (): StoryScript.ICreateCharacter => {
                    return {
                        steps: [
                            {
                                questions: [
                                    {
                                        question: 'Do you want to...',
                                        entries: [
                                            {
                                                text: 'Start a regular game',
                                                value: '1'
                                            },
                                            {
                                                text: 'Use the alternate start',
                                                value: '2'
                                            },
                                            
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
                                        default: {
                                            return 0;
                                        }
                                    }
                                }
                            },
                            {
                                questions: [
                                    {
                                        question: 'Select your story',
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
                                nextStepSelector: 4
                            },
                            {
                                questions: [
                                    {
                                        question: 'Select your story',
                                        entries: [
                                            {
                                                text: 'You are a druid',
                                                value: 'intelligence',
                                                bonus: 1
                                            },
                                            {
                                                text: 'You are a veteran warrior',
                                                value: 'strength',
                                                bonus: 1
                                            },
                                            {
                                                text: 'You are a fisherman',
                                                value: 'agility',
                                                bonus: 1
                                            }
                                        ]
                                    }
                                ],
                                
                                nextStepSelector: 4
                            },
                            {
                                questions: [
                                    {
                                        question: 'Good luck...',
                                        entries: []
                                    }
                                ]
                            }
                        ]
                    };
                },

                createCharacter: (game: IGame, characterData: StoryScript.ICreateCharacter): StoryScript.ICharacter => {
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
                        game.currentLocation.activeEnemies.filter((enemy: IEnemy) => { return enemy.hitpoints > 0; }).forEach(function (enemy) {
                            // Implement monster attack here
                        });
                    }
                }
            }
        };
    }
}