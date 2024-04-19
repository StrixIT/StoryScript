import { IRules, ICharacter, ICreateCharacter, ActionStatus } from 'storyScript/Interfaces/storyScript';
import { IGame, IEnemy, Character, ICompiledLocation, IItem, IDestination, IAction } from './types';
import { CharacterClasses } from './characterClass';
import { ClassType } from './classType';

export function Rules(): IRules {
    return {
        setup: {
            setupGame: (game: IGame): void => {
                game.worldProperties = {
                    currentDay: 0,
                    isDay: true,
                    isNight: false,
                    timeOfDay: 'day',
                    freedFaeries: false,
                    travelCounter: 0
                };
            },
            gameStart: (game: IGame): void => {
            }
        },

        general: {
            scoreChange: (game: IGame, change: number): boolean => {
                // Implement logic to occur when the score changes. Return true when the character gains a level.
                return false;
            }
        },

        character: {

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
                            ]
                        },
                    ]
                };
            },

            createCharacter: (game: IGame, characterData: ICreateCharacter): ICharacter => {
                var character = new Character();
                var selectedClass = characterData.steps[1].questions[0].selectedEntry.value;
                var characterClass = CharacterClasses[selectedClass];
                character.hitpoints = characterClass.hitpoints;
                character.items = characterClass.inventory.map(i => i());
                character.class = characterClass;
                character.portraitFileName = characterClass.picture;
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
                var totalDamage = Math.max(0, weaponDamage + game.helpers.calculateBonus(game.character, 'damageBonus') - (enemy.defence ?? 0));
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
                    var enemyDamage =game.helpers.rollDice(enemy.damage) + game.helpers.calculateBonus(enemy, 'damageBonus');
                    game.logToCombatLog('The ' + enemy.name + ' does ' + enemyDamage + ' damage!');
                    game.character.currentHitpoints -= enemyDamage;
                });
            }
        },

        exploration: {
            enterLocation: (game: IGame, location: ICompiledLocation, travel: boolean): void => {
                if (travel) {
                    if (typeof game.worldProperties.isDay === 'undefined') {
                        game.worldProperties.isDay = true;
                        game.worldProperties.isNight = false;
                    }

                    game.worldProperties.travelCounter ??= 0;
                    game.worldProperties.travelCounter++;
                    const duskDawn = game.worldProperties.travelCounter % 4 === 0;

                    if (duskDawn) {
                        game.worldProperties.isDay = !game.worldProperties.isDay;
                        game.worldProperties.isNight = !game.worldProperties.isNight;
                    }

                    game.worldProperties.timeOfDay = game.worldProperties.isDay ? 'day' : 'night';
                }

                if (location.enemies?.length > 0) {
                    location.enemies.forEach(enemy => enemy.inactive = !isEntityActive(game, enemy));
                }

                if (location.items?.length > 0) {
                    location.items.forEach(item => item.inactive = !isEntityActive(game, item));
                }

                if (location.destinations?.length > 0) {
                    location.destinations.forEach(destination => destination.inactive = !isEntityActive(game, destination));
                }

                if (location.actions?.length > 0) {
                    location.actions.forEach(action => action.status = !isEntityActive(game, action) ? ActionStatus.Unavailable : action.status);
                }

                if (game.worldProperties.isNight) {
                    var element = <HTMLElement>game.UIRootElement?.querySelector('location-container');

                    if (element) {
                        element.style.cssText = 'filter: brightness(50%);';
                    }
                }
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