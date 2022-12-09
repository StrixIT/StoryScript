import { StateList } from 'storyScript/Interfaces/stateList';
import { IRules, ICharacter, ICreateCharacter, ICombinationAction, GameState } from 'storyScript/Interfaces/storyScript';
import { createPromiseForCallback, selectStateListEntry } from 'storyScript/utilities';
import { Class } from './interfaces/class';
import { ShipBow } from './locations/ShipBow';
import { Shipsdeck } from './locations/shipsdeck';
import { ShipsHold } from './locations/ShipsHold';
import { ShipsHoldAft } from './locations/ShipsHoldAft';
import { ShipsholdFront } from './locations/ShipsholdFront';
import { ShipStern } from './locations/shipStern';
import { Start } from './locations/start';
import { IGame, IEnemy, Character, ILocation } from './types';

const combatTimeout: number = 1000;

const locationGradients = <StateList>{
    'gradient-ship-outside': [
        Start, Shipsdeck, ShipStern, ShipBow
    ],
    'gradient-ship-inside': [
        ShipsHold, ShipsholdFront, ShipsHoldAft
    ],
    'gradient-intro': [
        GameState.Intro
    ]
};

export function Rules(): IRules {

    return {
        setup: {
            intro: true,
            getCombinationActions: (): ICombinationAction[] => {
                return [
                    // Add combination action names here if you want to use this feature.
                ];
            },
            playList: {
                'Medieval.mp3': [GameState.CreateCharacter, GameState.Intro],
                'underwater.mp3': [GameState.Play],
                'Shipshold.mp3':
                [
                    ShipsHold, ShipsHoldAft,ShipsholdFront
                ],
            },
            autoBackButton: false
        },

        general: {  
            scoreChange: (game: IGame, change: number): boolean => {
                // Implement logic to occur when the score changes. Return true when the character gains a level.
                return false;
            },
            gameStateChange(game) {
                setGradient(game);
            },
        },
        
        character: {
            getSheetAttributes: (): string[] => {
                return [
                    // Add the character attributes that you want to show on the character sheet here
                ];
            },

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
                                    question: 'Do you wish to choose your class manually, or answer questions to determine your path?',
                                    entries: [
                                        {
                                            text: 'Choose my class',
                                            value: '2'
                                        },
                                        {
                                            text: 'Answer Questions',
                                            value: '3'
                                        }
                                    ]
                                }
                            ],
                            nextStepSelector: (_, currentStep) => {
                                switch (currentStep.questions[0].selectedEntry.value) {
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
                                    question: 'Choose your class',
                                    entries: [
                                        {
                                            text: Class.Rogue,
                                            value: Class.Rogue
                                        },
                                        {
                                            text: Class.Warrior,
                                            value: Class.Warrior
                                        },
                                        {
                                            text: Class.Wizard,
                                            value: Class.Wizard
                                        }
                                    ]
                                }
                            ],          
                            nextStepSelector(character, currentStep) {
                                var selectedClass = currentStep.questions[0].selectedEntry.value;
                                var confirmStep = character.steps[9];
                                confirmStep.questions[0].question = `You have chosen the path of the ${selectedClass}. Do you want to be a ${selectedClass}?`;
                                return 9;
                            },
                        },
                        {
                            questions: [
                                {
                                    question: 'You witness the village bully pestering a little child. Do you:',
                                    entries: [
                                        {
                                            text: 'Challenge him to try on someone his own size, namely you?',
                                            value: Class.Warrior,
                                            bonus: 1
                                        },
                                        {
                                            text: 'Try to sneak up on him and trip him, making him fall into a puddle of mud?',
                                            value: Class.Rogue,
                                            bonus: 1
                                        },
                                        {
                                            text: 'Try to talk to him and show him the error of his ways?',
                                            value: Class.Wizard,
                                            bonus: 1
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            questions: [
                                {
                                    question: 'Your grandfather has been telling you stories of the gods of the old homeland. Stories of the mighty Thor, the wise Odin and the clever Loki. He promises to teach you a prayer to one of the gods to invoke his blessing. Which god do you choose?',
                                    entries: [
                                        {
                                            text: 'Thor, the god of storms and lightning, the destroyer of giants.',
                                            value: Class.Warrior,
                                            bonus: 1
                                        },
                                        {
                                            text: 'Loki, the god of trickery and deceit, the troublemaker.',
                                            value: Class.Rogue,
                                            bonus: 1
                                        },
                                        {
                                            text: 'Odin, the god of wisdom and insight, the Allfather.',
                                            value: Class.Wizard,
                                            bonus: 1
                                        },

                                    ]
                                }
                            ]
                        },
                        {
                            questions: [
                                {
                                    question: 'A wolf has been ravaging the flocks of sheep of your village. Do you:',
                                    entries: [
                                        {
                                            text: 'Go out and hunt the beast?',
                                            value: Class.Warrior,
                                            bonus: 1
                                        },
                                        {
                                            text: 'Set a devious trap?',
                                            value: Class.Rogue,
                                            bonus: 1
                                        },
                                        {
                                            text: 'Design and build a new fence to keep the wolf and future predators out?',
                                            value: Class.Wizard,
                                            bonus: 1
                                        },

                                    ]
                                }
                            ]
                        },

                        {
                            questions: [
                                {
                                    question: 'Your village holds the yearly Harvest festival, which has many games. Do you:',
                                    entries: [
                                        {
                                            text: 'Participate in the Wrestling contest? ',
                                            value: Class.Warrior,
                                            bonus: 1
                                        },
                                        {
                                            text: 'Participate in the Archery contest?',
                                            value: Class.Rogue,
                                            bonus: 1
                                        },
                                        {
                                            text: 'Participate in the Puzzle contest?',
                                            value: Class.Wizard,
                                            bonus: 1
                                        },

                                    ]
                                }
                            ]
                        },
                        {
                            questions: [
                                {
                                    question: 'An item of great importance to your village has been stolen from the house of the mayor. The local magistrate has identified several suspects, but his questioning so far has led to no results. You think you could do better, and if it where up to you, would you:',
                                    entries: [
                                        {
                                            text: 'Use strength and intimidation to get some answers.',
                                            value: Class.Warrior,
                                            bonus: 1
                                        },
                                        {
                                            text: 'Use stealth to follow the movements of the suspects, and agility to enter their houses undetected and search for clues.',
                                            value: Class.Rogue,
                                            bonus: 1
                                        },
                                        {
                                            text: 'Use deduction and reasoning to get to the truth.',
                                            value: Class.Wizard,
                                            bonus: 1
                                        },

                                    ]
                                }
                            ]
                        },
                        {
                            questions: [
                                {
                                    question: 'You are in love with the most beautiful girl in the village. But you are not the only one. One of your competitors has written a striking poem, and you know the girl loves poetry. Do you:',
                                    entries: [
                                        {
                                            text: 'Ignore the poetry and try to impress the girl with a show of strength?',
                                            value: Class.Warrior,
                                            bonus: 1
                                        },
                                        {
                                            text: 'Try to steal his poem and pass it off as you own?',
                                            value: Class.Rogue,
                                            bonus: 1
                                        },
                                        {
                                            text: 'Try to write an even better poem?',
                                            value: Class.Wizard,
                                            bonus: 1
                                        }
                                    ]
                                }
                            ],
                            nextStepSelector: 9
                        },
                        {
                            initStep: (character, previousStep, currentStep) => {
                                var classSelect = character.steps[2].questions[0];
                                var selectedClass = classSelect.selectedEntry ? classSelect.selectedEntry.value : null;
                                var points = {
                                    Warrior: 0,
                                    Rogue: 0,
                                    Wizard: 0
                                };

                                // If questions were answered, calculate which class has the highest score.
                                if (previousStep > 2) {
                                    for (var i = 3; i <= previousStep; i++) {
                                        var selectedEntry = character.steps[i].questions[0].selectedEntry;
                                        points[selectedEntry.value] += selectedEntry.bonus;
                                    }

                                    // When the scores are equal, the first class in the list wins (first warrior, then rogue, then wizard).
                                    var max = Math.max(points.Warrior, points.Rogue, points.Wizard);
                                    selectedClass = max === points.Warrior ? Class.Warrior : max === points.Rogue ? Class.Rogue : Class.Wizard;
                                }

                                // Update the class selector step to use when processing the character sheet data.
                                classSelect.selectedEntry = classSelect.entries.filter(entry => entry.value === selectedClass)[0];
                                
                                var nextQuestion = currentStep.questions[0]; 

                                if (previousStep > 2)
                                {
                                    nextQuestion.question = `Your path seems to be that of the ${selectedClass}. Do you want to be a ${selectedClass}?`;
                                }

                                nextQuestion.entries[1].text = `Yes, proceed as a ${selectedClass}`;
                            },
                            questions: [
                                {
                                    question: '',
                                    entries: [
                                        {
                                            text: 'No, select another class',
                                            value: "no",
                                        },
                                        {
                                            text: '',
                                            value: "yes"
                                        }
                                    ]
                                }
                            ],
                            nextStepSelector(_, currentStep) {
                                switch (currentStep.questions[0].selectedEntry.value) {
                                    case 'no': {
                                        return 2;
                                    };
                                    case 'yes': {
                                        return 10;
                                    };
                                    default: {
                                        return 0;
                                    }
                                }
                            },
                        },
                        {
                            description: 'You are ready to embark on your yourney.'
                        }
                    ]
                };
            },

            createCharacter: (game: IGame, characterData: ICreateCharacter): ICharacter => {
                var character = new Character();

                var characterClass = characterData.steps[2].questions[0].selectedEntry.value;

                switch (characterClass) {
                    case Class.Warrior: {
                        character.strength = 3;
                        character.agility = 1;
                        character.intelligence = 1;
                        character.class = Class.Warrior;
                    }; break;
                    case Class.Rogue: {
                        character.strength = 1;
                        character.agility = 3;
                        character.intelligence = 1;
                        character.class = Class.Rogue;
                    }; break;
                    case Class.Wizard: {
                        character.strength = 1;
                        character.agility = 1;
                        character.intelligence = 3;
                        character.class = Class.Wizard;
                    }; break;
                }

                return character;
            }
        },

        exploration: {
            enterLocation: (game: IGame) => {
                setGradient(game);
            }
        },

        combat: {     
            fight: (game: IGame, enemy: IEnemy): Promise<void> | void => {
                game.combatLog.length = 0;
                var equipment = game.character.equipment;

                if (equipment.rightHand?.attackText) {
                    game.logToCombatLog(equipment.rightHand?.attackText);
                }

                if (equipment.leftHand?.attackText) {
                    game.logToCombatLog(equipment.leftHand?.attackText);
                }

                var damage = game.helpers.rollDice('1d6') + game.character.strength + game.helpers.calculateBonus(game.character, 'damage');
                var attackSound = equipment.rightHand?.attackSound ?? equipment.leftHand?.attackSound;
                return fight(game, enemy, attackSound, damage);
            }
        }
    };
}

export function fight(game: IGame, enemy: IEnemy, attackSound: string, damage: number): Promise<void> | void {
    var callBack = () => continueFight(game, enemy, damage);

    if (attackSound) {
        const { promise, promiseCallback } = createPromiseForCallback<void>(callBack);
        game.sounds.playSound(attackSound, promiseCallback);
        return promise;              
    }
    else {
        callBack();
    }
}

const continueFight = function(game: IGame, currentEnemy: IEnemy, damage: number): Promise<void> | void {
    game.combatLog.push('You do ' + damage + ' damage to the ' + currentEnemy.name + '!');
    currentEnemy.hitpoints -= damage;

    if (currentEnemy.hitpoints <= 0) {
        game.combatLog.push('You defeat the ' + currentEnemy.name + '!');
    }

    var promise: Promise<void> | void = null;

    game.currentLocation.activeEnemies.filter((enemy: IEnemy) => { return enemy.hitpoints > 0; }).forEach(async enemy => {
        if (!promise) {
            promise = waitPromise();
        }
        else {
            promise = promise.then(() => waitPromise());
        }

        promise = promise.then(() => enemyAttack(game, enemy));
    });

    return promise;
}

const waitPromise = function(): Promise<void>
{
    return new Promise<void>(function(resolve) {
        setTimeout(() => {
            resolve();
          }, combatTimeout);
    });
}

const enemyAttack = function (game: IGame, enemy: IEnemy): Promise<void> | void {
    game.combatLog.push(enemy.attackText ?? 'The ' + enemy.name + ' attacks!');
    
    var attackSound = enemy.attackSound;
    var callBack = () => enemyAttacks(game, enemy);

    if (attackSound) {
        const { promise, promiseCallback } = createPromiseForCallback<void>(callBack);
        game.sounds.playSound(attackSound, promiseCallback);
        return promise;              
    }
    else {
        callBack();
    }
}

const enemyAttacks = function (game: IGame, enemy: IEnemy): Promise<void> | void {
    var damage = game.helpers.rollDice(enemy.attack) + game.helpers.calculateBonus(enemy, 'damage');
    game.combatLog.push('The ' + enemy.name + ' does ' + damage + ' damage!');
    game.character.currentHitpoints -= damage;
}

const setGradient = function(game: IGame) {
    var gradientClass = selectStateListEntry(game, locationGradients);

    if (gradientClass) {
        // When refreshing the page, the UIRootElement is not yet on the game so use a timeout.
        if (game.UIRootElement) {
            setGradientClass(game.UIRootElement, gradientClass);
        }
        else {
            setTimeout(() => {
                setGradientClass(game.UIRootElement, gradientClass);
            });
        }
    }
}

const setGradientClass = function(element: HTMLElement, className: string) {
    element.classList.forEach(c => { 
        if (c.startsWith('gradient')) {
            element.classList.remove(c);
        } 
    });

    element.classList.add(className);
}