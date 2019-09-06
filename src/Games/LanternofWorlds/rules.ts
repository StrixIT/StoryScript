namespace LanternofWorlds {
    export function Rules(): StoryScript.IRules {
        return {
            setup: {
                gameStart: (game: IGame) => {
                    game.changeLocation(game.worldProperties.startChoice);
                },
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
                                                value: '1',
                                                finish: true
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
                                            return 2;
                                        };
                                        case '2': {
                                            return 1;                             
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
                                finish: true
                            }
                        ]
                    };
                },

                createCharacter: (game: IGame, characterData: StoryScript.ICreateCharacter): StoryScript.ICharacter => {
                    var selectedStart = characterData.steps[1].questions[0].selectedEntry;
                    var startChoice = 'start';

                    if (selectedStart && selectedStart.text) {
                        startChoice = selectedStart.text === 'You are a druid' ? 'Druidstart'
                            : selectedStart.text === 'You are a fisherman' ? 'Fishermanstart' 
                            : selectedStart.text === 'You are a veteran warrior' ? 'forest' : 'start';
                    }

                    game.worldProperties.startChoice = startChoice;

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