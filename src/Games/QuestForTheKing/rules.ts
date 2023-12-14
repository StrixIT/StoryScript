import { IRules, ICharacter, ICreateCharacter } from 'storyScript/Interfaces/storyScript';
import { IGame, IEnemy, Character, ICompiledLocation, IItem, IDestination, IAction } from './types';
import { Class } from './classes';
import { changeDay } from './gameFunctions';
import { LongSword } from './items/LongSword';
import { Battleaxe } from './items/BattleAxe';
import { Warhammer } from './items/Warhammer';
import { Dagger } from './items/Dagger';
import { Rapier } from './items/Rapier';
import { Shortsword } from './items/Shortsword';
import { Fireball } from './items/Fireball';
import { Frostbite } from './items/Frostbite';
import { Shockbolt } from './items/Shockbolt';
import { Start } from './locations/tournament/start';
import { Quest1 } from './locations/Quest1';

export function Rules(): IRules {
    return {
        setup: {
            setupGame: (game: IGame): void => {
                game.worldProperties = {
                    startLocation: Start.name,
                    currentDay: 0,
                    isDay: true,
                    isNight: false,
                    timeOfDay: 'day',
                    freedFaeries: false,
                    travelCounter: 0
                };
            },
            gameStart: (game: IGame): void => {
                if (game.worldProperties.startLocation !== Start.name) {
                    game.changeLocation(game.worldProperties.startLocation);
                }
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
                    'strength',
                    'agility',
                    'intelligence',
                    'charisma',
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
                            nextStepSelector: (character, currentStep) => {
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
                                            text: 'Rogue',
                                            value: 'rogue'
                                        },
                                        {
                                            text: 'Warrior',
                                            value: 'warrior'
                                        },
                                        {
                                            text: 'Wizard',
                                            value: 'wizard'
                                        }
                                    ]
                                }
                            ],
                            nextStepSelector: 9
                        },
                        {
                            questions: [
                                {
                                    question: 'You witness the village bully pestering a little child. Do you:',
                                    entries: [
                                        {
                                            text: 'Challenge him to try on someone his own size, namely you?',
                                            value: 'warrior',
                                            bonus: 1
                                        },
                                        {
                                            text: 'Try to sneak up on him and trip him, making him fall into a puddle of mud?',
                                            value: 'rogue',
                                            bonus: 1
                                        },
                                        {
                                            text: 'Try to talk to him and show him the error of his ways?',
                                            value: 'wizard',
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
                                            value: 'warrior',
                                            bonus: 1
                                        },
                                        {
                                            text: 'Loki, the god of trickery and deceit, the troublemaker.',
                                            value: 'rogue',
                                            bonus: 1
                                        },
                                        {
                                            text: 'Odin, the god of wisdom and insight, the Allfather.',
                                            value: 'wizard',
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
                                            value: 'warrior',
                                            bonus: 1
                                        },
                                        {
                                            text: 'Set a devious trap?',
                                            value: 'rogue',
                                            bonus: 1
                                        },
                                        {
                                            text: 'Design and build a new fence to keep the wolf and future predators out?',
                                            value: 'wizard',
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
                                            value: 'warrior',
                                            bonus: 1
                                        },
                                        {
                                            text: 'Participate in the Archery contest?',
                                            value: 'rogue',
                                            bonus: 1
                                        },
                                        {
                                            text: 'Participate in the Puzzle contest?',
                                            value: 'wizard',
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
                                            value: 'warrior',
                                            bonus: 1
                                        },
                                        {
                                            text: 'Use stealth to follow the movements of the suspects, and agility to enter their houses undetected and search for clues.',
                                            value: 'rogue',
                                            bonus: 1
                                        },
                                        {
                                            text: 'Use deduction and reasoning to get to the truth.',
                                            value: 'wizard',
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
                                            value: 'warrior',
                                            bonus: 1
                                        },
                                        {
                                            text: 'Try to steal his poem and pass it off as you own?',
                                            value: 'rogue',
                                            bonus: 1
                                        },
                                        {
                                            text: 'Try to write an even better poem?',
                                            value: 'wizard',
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
                                var characterClass = classSelect.selectedEntry ? classSelect.selectedEntry.value : null;
                                var points = {
                                    warrior: 0,
                                    rogue: 0,
                                    wizard: 0
                                };

                                // If questions were answered, calculate which class has the highest score.
                                if (previousStep > 2) {
                                    for (var i = 3; i <= previousStep; i++) {
                                        var selectedEntry = character.steps[i].questions[0].selectedEntry;
                                        points[selectedEntry.value] += selectedEntry.bonus;
                                    }

                                    // When the scores are equal, the first class in the list wins (first warrior, then rogue, then wizard).
                                    var max = Math.max(points.warrior, points.rogue, points.wizard);
                                    characterClass = max === points.warrior ? 'warrior' : max === points.rogue ? 'rogue' : 'wizard';
                                }

                                // Set the items to chose from.
                                switch (characterClass) {
                                    case 'warrior': {
                                        currentStep.questions[0].entries = [
                                            {
                                                text: LongSword().name,
                                                value: LongSword.name                                          
                                            },
                                            {
                                                text: Battleaxe().name,
                                                value: Battleaxe.name
                                            },
                                            {
                                                text: Warhammer().name,
                                                value: Warhammer.name
                                            }
                                        ];
                                    }; break;
                                    case 'rogue': {
                                        currentStep.questions[0].entries = [
                                            {
                                                text: Dagger().name,
                                                value: Dagger.name
                                            },
                                            {
                                                text: Rapier().name,
                                                value: Rapier.name
                                            },
                                            {
                                                text: Shortsword().name,
                                                value: Shortsword.name
                                            }
                                        ];
                                    }; break;
                                    case 'wizard': {
                                        currentStep.questions[0].entries = [
                                            {
                                                text: Fireball().name,
                                                value: Fireball.name
                                            },
                                            {
                                                text: Frostbite().name,
                                                value: Frostbite.name
                                            },
                                            {
                                                text: Shockbolt().name,
                                                value: Shockbolt.name
                                            }
                                        ];
                                    }; break;
                                }

                                // Update the class selector step to use when processing the character sheet data.
                                classSelect.selectedEntry = classSelect.entries.filter(entry => entry.value === characterClass)[0];
                            },
                            questions: [
                                {
                                    question: 'Select your weapon',
                                    entries: [
                                    ]
                                }
                            ]
                        },
                        {
                            questions: [
                                {
                                    question: 'Start the tournament or begin the quest?',
                                    entries: [
                                        {
                                            text: 'Fight in the tournament',
                                            value: Start.name
                                        },
                                        {
                                            text: 'Begin the quest',
                                            value: Quest1.name
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                };
            },

            createCharacter: (game: IGame, characterData: ICreateCharacter): ICharacter => {
                var character = new Character();

                var characterClass = characterData.steps[2].questions[0].selectedEntry.value;

                switch (characterClass) {
                    case 'warrior': {
                        character.strength = 3;
                        character.agility = 1;
                        character.intelligence = 1;
                        character.charisma = 1;
                        character.class = Class.Warrior;
                    }; break;
                    case 'rogue': {
                        character.strength = 1;
                        character.agility = 3;
                        character.intelligence = 1;
                        character.charisma = 1;
                        character.class = Class.Rogue;
                    }; break;
                    case 'wizard': {
                        character.strength = 1;
                        character.agility = 1;
                        character.intelligence = 3;
                        character.charisma = 1;
                        character.class = Class.Wizard;
                    }; break;
                }

                var weaponStep = characterData.steps[characterData.steps.length - 2];
                var chosenItem = weaponStep.questions[0].selectedEntry;
                character.items.push(game.helpers.getItem(chosenItem.value));

                game.worldProperties.startLocation = characterData.steps[characterData.steps.length - 1].questions[0].selectedEntry.value;

                return character;
            }
        },

        combat: {
            fight: (game: IGame, enemy: IEnemy): void => {
                game.combatLog = [];

                var leftHandWeapon = game.character.equipment.leftHand;
                var rightHandWeapon = game.character.equipment.rightHand;

                // For two-handed weapons, calculate only one damage.
                if (leftHandWeapon === rightHandWeapon) {
                    rightHandWeapon = null;
                }

                var weaponDamage = (leftHandWeapon ? game.helpers.rollDice(leftHandWeapon.damage) : 0) + (rightHandWeapon ? game.helpers.rollDice(rightHandWeapon.damage) : 0);
                var totalDamage = weaponDamage + game.character.strength + game.helpers.calculateBonus(game.character, 'damage');
                var leftHandCombatText= game.character.equipment.leftHand ? game.character.equipment.leftHand.attackText : '';
                var rightHandCombatText = game.character.equipment.rightHand ? game.character.equipment.rightHand.attackText : '';
                var combatText = leftHandCombatText && rightHandCombatText && game.character.equipment.leftHand.id !== game.character.equipment.rightHand.id ? leftHandCombatText + '. ' + rightHandCombatText : leftHandCombatText || rightHandCombatText;
                enemy.hitpoints -= totalDamage;

                if (combatText) {
                game.logToCombatLog(combatText + '.');
                }

                game.logToCombatLog('You do ' + totalDamage + ' damage to the ' + enemy.name + '!');

                if (enemy.hitpoints <= 0) {
                game.logToCombatLog('You defeat the ' + enemy.name + '!');

                    if (!game.currentLocation.activeEnemies.some(enemy => enemy.hitpoints > 0)) {
                        var currentSelector = descriptionSelector(game);
                        var selector = currentSelector ? currentSelector + 'after' : 'after';
                        selector = game.currentLocation.descriptions[selector] ? selector : 'after';
                        game.currentLocation.descriptionSelector = selector;
                        game.playState = null;
                    }
                }

                game.currentLocation.activeEnemies.filter(enemy => { return enemy.hitpoints > 0; }).forEach(function (enemy: IEnemy) {
                    var enemyDamage =game.helpers.rollDice(enemy.attack) + game.helpers.calculateBonus(enemy, 'damage');
                    game.logToCombatLog('The ' + enemy.name + ' does ' + enemyDamage + ' damage!');
                    game.character.currentHitpoints -= enemyDamage;
                });
            }
        },

        exploration: {
            enterLocation: (game: IGame, location: ICompiledLocation, travel: boolean): void => {
                if (travel) {
                    if (game.worldProperties.travelCounter !== undefined) {
                    game.worldProperties.travelCounter++;

                        var isDay = Math.floor(game.worldProperties.travelCounter / 3 + 1) % 2 !== 0;
                    game.worldProperties.isDay = isDay;
                    game.worldProperties.isNight = !isDay;
                    game.worldProperties.timeOfDay = isDay ? 'day' : 'night';
                    }
                }

                if (location.enemies?.length > 0) {
                    location.enemies.forEach(enemy => enemy.inactive = !isEntityActive(game, enemy));
                }

                if (location.items?.length > 0) {
                    location.items.forEach(item => item.inactive = !isEntityActive(game, item));
                }

                if (location.destinations && location.destinations.length > 0) {
                    location.destinations.forEach(destination => destination.inactive = !isEntityActive(game, destination));
                }

                if (location.actions && location.actions.length > 0) {
                    location.actions.forEach(action => action.inactive = !isEntityActive(game, action));
                }

                if (game.worldProperties.isNight) {
                    var element = <HTMLElement>game.UIRootElement?.querySelector('img.map');

                    if (element) {
                        element.style.cssText = 'filter: brightness(50%);';
                    }
                }

                changeDay(game);
            },

            descriptionSelector: descriptionSelector
        }
    };

    function descriptionSelector (game: IGame): string {
        return game.worldProperties.travelCounter ?
            game.worldProperties.isNight ?
                game.currentLocation.completedNight ? 'completednight' :
                    'night' :
                game.currentLocation.completedDay ? 'completedday' :
                    'day' :
            null;
    }

    function isEntityActive (game: IGame, entity: IItem | IEnemy | IDestination | IAction): boolean {
        return (!entity.activeNight && !entity.activeDay) || (entity.activeNight && game.worldProperties.isNight) || (entity.activeDay && game.worldProperties.isDay)
    }
}