import {ICharacter, ICompiledLocation, ICreateCharacter, IRules} from 'storyScript/Interfaces/storyScript';
import {Character, IEnemy, IGame} from './types';
import {Dagger} from './items/dagger';
import {LeatherHelmet} from './items/leatherHelmet';
import {Lantern} from './items/lantern';
import {Flee} from './actions/flee';
import {ICombatSetup} from "./interfaces/combatSetup.ts";

export function Rules(): IRules {
    return {
        setup: {},

        general: {
            scoreChange: (game: IGame, change: number): boolean => {
                var character = game.activeCharacter;
                character.scoreToNextLevel += change;
                var levelUp = character.level >= 1 && character.scoreToNextLevel >= 2 + (2 * (character.level));

                //game.logToActionLog('Je verdient ' + change + ' punt(en)');

                if (levelUp) {
                    character.level += 1;
                    character.scoreToNextLevel = 0;
                    game.logToActionLog('Je wordt hier beter in! Je bent nu niveau ' + character.level);
                }

                return levelUp;
            }
        },

        character: {
            getSheetAttributes: (): string[] => {
                return [
                    'kracht',
                    'vlugheid',
                    'oplettendheid',
                    'verdediging'
                ];
            },

            getCreateCharacterSheet: (): ICreateCharacter => {
                return {
                    steps: [
                        {
                            attributes: [
                                {
                                    question: 'Hoe heet je?',
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
                                    question: 'Ben je sterk, snel of slim?',
                                    entries: [
                                        {
                                            text: 'Sterk',
                                            value: 'kracht',
                                            bonus: 1
                                        },
                                        {
                                            text: 'Snel',
                                            value: 'vlugheid',
                                            bonus: 1
                                        },
                                        {
                                            text: 'Slim',
                                            value: 'oplettendheid',
                                            bonus: 1
                                        }
                                    ]
                                },
                                {
                                    question: 'Wat neem je mee?',
                                    entries: [
                                        {
                                            text: 'Dolk',
                                            value: Dagger.name,
                                        },
                                        {
                                            text: 'Leren helm',
                                            value: LeatherHelmet.name,
                                        },
                                        {
                                            text: 'Lantaren',
                                            value: Lantern.name,
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                };
            },

            getLevelUpSheet: (): ICreateCharacter => {
                return {
                    steps: [
                        {
                            questions: [
                                {
                                    question: 'Wat wil je verbeteren?',
                                    entries: [
                                        {
                                            text: 'Kracht',
                                            value: 'kracht',
                                            bonus: 1
                                        },
                                        {
                                            text: 'Vlugheid',
                                            value: 'vlugheid',
                                            bonus: 1
                                        },
                                        {
                                            text: 'Oplettendheid',
                                            value: 'oplettendheid',
                                            bonus: 1
                                        },
                                        {
                                            text: 'Gezondheid',
                                            value: 'gezondheid',
                                            bonus: 1
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            },

            levelUp: (character: ICharacter, characterData: ICreateCharacter): boolean => {
                var question = characterData.steps[0].questions[0];
                var reward = question.entries.filter(entry => entry.value === question.selectedEntry.value)[0].value;

                if (reward != 'gezondheid') {
                    character[reward]++;
                } else {
                    character.hitpoints += 10;
                    character.currentHitpoints += 10;
                }

                return false;
            },

            createCharacter: (game: IGame, characterData: ICreateCharacter): ICharacter => {
                var character = new Character();
                var chosenItem = characterData.steps[1].questions[1].selectedEntry;
                character.items.push(game.helpers.getItem(chosenItem.value));
                return character;
            },

            hitpointsChange(game: IGame, character: ICharacter, change: number) {
                if (game.activeCharacter.hitpoints < 5) {
                    game.logToActionLog('Pas op! Je bent zwaar gewond!');
                    game.logToCombatLog('Pas op! Je bent zwaar gewond!');
                }
            }
        },

        exploration: {
            enterLocation: (game: IGame, location: ICompiledLocation): void => {
                //game.logToActionLog('Je komt aan in ' + location.name);

                if (location.id != 'start' && !location.hasVisited) {
                    game.party.score += 1;
                }

                if (location.activeEnemies) {
                    location.activeEnemies.forEach(function (enemy) {
                        game.logToActionLog('Er is hier een ' + enemy.name);
                    });
                }
            }
        },

        combat: {
            initCombat: (game: IGame, location: ICompiledLocation): void => {
                addFleeAction(game, location);
            },

            fight: (game: IGame, combatSetup: ICombatSetup, retaliate?: boolean): void => {
                var character = combatSetup[0].character;
                var enemy = combatSetup[0].target;
                var check = game.helpers.rollDice(6, character.kracht);
                var characterDamage = check + character.oplettendheid + game.helpers.calculateBonus(character, 'schade') - game.helpers.calculateBonus(enemy, 'verdediging');
                game.logToCombatLog('Je doet de ' + enemy.name + ' ' + characterDamage + ' schade!');
                enemy.currentHitpoints -= characterDamage;

                if (enemy.currentHitpoints <= 0) {
                    game.logToCombatLog('Je verslaat de ' + enemy.name + '!');
                    game.logToActionLog('De ' + enemy.name + ' is dood.');
                    game.logToLocationLog('Er ligt hier een dode ' + enemy.name + ', door jou verslagen.');
                }

                game.currentLocation.activeEnemies.filter((enemy: IEnemy) => {
                    return enemy.currentHitpoints > 0;
                }).forEach(function (enemy) {
                    var check = game.helpers.rollDice(enemy.attack);
                    var enemyDamage = Math.max(0, (check - (character.vlugheid + game.helpers.calculateBonus(character, 'verdediging'))) + game.helpers.calculateBonus(enemy, 'schade'));
                    game.logToCombatLog('De ' + enemy.name + ' doet ' + enemyDamage + ' schade!');
                    character.currentHitpoints -= enemyDamage;
                });
            },

            enemyDefeated: (game: IGame, character: ICharacter, enemy: IEnemy): void => {
                if (enemy.reward) {
                    game.party.score += enemy.reward;
                }
            }
        },
    };

    function addFleeAction(game: IGame, location: ICompiledLocation): void {
        var numberOfEnemies = location.activeEnemies.length;
        var fleeAction = location.combatActions.get('Flee');

        if (!fleeAction && numberOfEnemies > 0 && numberOfEnemies < game.activeCharacter.vlugheid) {
            var action = Flee('');
            location.combatActions.add(['Flee', action]);
        }
    }
}