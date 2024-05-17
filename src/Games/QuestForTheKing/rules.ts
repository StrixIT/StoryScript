import { IRules, ICharacter, ICreateCharacter, ActionStatus, ICreateCharacterStep, format} from 'storyScript/Interfaces/storyScript';
import { IGame, IEnemy, Character, ICompiledLocation, IItem, IDestination, IAction, IParty, ICombatSetup  } from './types';
import { CharacterClasses } from './characterClass';
import { ClassType } from './classType';
import { TargetType } from '../../Engine/Interfaces/enumerations/targetType';

export function Rules(): IRules {
    return {
        setup: {
            numberOfCharacters: 3,
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
            gameStart(game: IGame) {
                game.party.currency ??= 0;
            },
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
            initCombatRound: (game: IGame, combat: ICombatSetup): void => {
                if (useBows(combat)) {
                    filterBows(combat, i => i.ranged)
                    
                } else {
                    filterBows(combat, i => !i.ranged)
                }
            },

            fight: (game: IGame, combatSetup: ICombatSetup): void => {
                game.combatLog = [];

                combatSetup.forEach((s, i) => {
                    const character = game.party.characters[i];
                    const enemy = s.target;

                    if (!s.item) {
                        return;
                    }
                    // var leftHandWeapon = character.equipment.leftHand;
                    // var rightHandWeapon = character.equipment.rightHand;

                    // // For two-handed weapons, calculate only one damage.
                    // if (leftHandWeapon === rightHandWeapon) {
                    //     rightHandWeapon = null;
                    // }

                    if (s.item.targetType === TargetType.Enemy) {
                        var weaponDamage = game.helpers.rollDice(s.item.damage);
                        var totalDamage = Math.max(0, weaponDamage + game.helpers.calculateBonus(character, 'damageBonus') - (enemy.defence ?? 0));
                        var combatText = format(s.item.attackText, [character.name]);
                        enemy.currentHitpoints -= totalDamage;
                    }

                    if (combatText) {
                        game.logToCombatLog(combatText + '.');
                    }

                    game.logToCombatLog(`${character.name} does ${totalDamage} damage to the ${enemy.name}!`);

                    if (enemy.currentHitpoints <= 0) {
                        game.logToCombatLog(`${character.name} defeats the ${enemy.name}!`);

                        if (!game.currentLocation.activeEnemies.some(enemy => enemy.currentHitpoints > 0)) {
                            var currentSelector = descriptionSelector(game);
                            var selector = currentSelector ? currentSelector + 'after' : 'after';
                            selector = game.currentLocation.descriptions[selector] ? selector : 'after';
                            game.currentLocation.descriptionSelector = selector;
                            game.playState = null;
                        }
                    }
                });

                if (!useBows(combatSetup)) {
                    game.currentLocation.activeEnemies.filter(enemy => { return enemy.currentHitpoints > 0; }).forEach(function (enemy: IEnemy) {
                        var enemyDamage = game.helpers.rollDice(enemy.damage) + game.helpers.calculateBonus(enemy, 'damageBonus');
                        game.logToCombatLog('The ' + enemy.name + ' does ' + enemyDamage + ' damage!');
                        game.activeCharacter.currentHitpoints -= enemyDamage;
                    });
                }
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

function useBows(combat: ICombatSetup): boolean {
    let useBows = false;
    
    if (combat.round === 1) {
        for (const turn of combat) {
            if (turn.itemsAvailable.filter(i => i.ranged).length > 0) {
                useBows = true;
                break;
            }
        }
    }

    return useBows;
}

function filterBows(combat: ICombatSetup, filter: any): void {
    combat.forEach(c => {
        c.itemsAvailable = c.itemsAvailable.filter(filter);
        c.item = c.itemsAvailable[0];

        if (!c.item) {
            c.targetsAvailable = null;
            c.target = null;
        }
    });
}
