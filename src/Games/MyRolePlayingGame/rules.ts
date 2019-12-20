import { IRules, ICreateCharacter, ICharacter, GameState } from 'storyScript/Interfaces/storyScript';
import { IGame, IEnemy, Character } from './types';

export function Rules(): IRules {
    return {
        setup: {
            playList: [
                // [GameState.CreateCharacter, 'createCharacter.mp3'],
                // [GameState.Play, 'play.mp3']
            ],

            intro: false,
        },

        general: {
            scoreChange: (game: IGame, change: number): boolean => {
                // Implement logic to occur when the score changes. Return true when the character gains a level.
                return false;
            }
        },

        character: {
            getSheetAttributes: (): string[] =>  {
                return [
                    'strength',
                    'agility',
                    'intelligence'
                ]
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
                            ]
                        },
                        {
                            questions: [
                                {
                                    question: 'When time came to become an apprentice, you chose to...',
                                    entries: [
                                        {
                                            text: 'become a guard',
                                            value: 'strength',
                                            bonus: 1
                                        },
                                        {
                                            text: 'learn about locks',
                                            value: 'agility',
                                            bonus: 1
                                        },
                                        {
                                            text: 'go to magic school',
                                            value: 'intelligence',
                                            bonus: 1
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
                return character;
            }
        },

        combat: {
            fight: (game: IGame, enemy: IEnemy): void => {
                var damage = game.helpers.rollDice('1d6') + game.character.strength + game.helpers.calculateBonus(game.character, 'damage');
                game.logToCombatLog('You do ' + damage + ' damage to the ' + enemy.name + '!');
                enemy.hitpoints -= damage;

                if (enemy.hitpoints <= 0) {
                    game.logToCombatLog('You defeat the ' + enemy.name + '!');
                }

                game.currentLocation.activeEnemies.filter((enemy: IEnemy) => { return enemy.hitpoints > 0; }).forEach(enemy => {
                    var damage = game.helpers.rollDice(enemy.attack) + game.helpers.calculateBonus(enemy, 'damage');
                    game.logToCombatLog('The ' + enemy.name + ' does ' + damage + ' damage!');
                    game.character.currentHitpoints -= damage;
                });
            }
        }
    };
}