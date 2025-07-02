import { IRules, ICreateCharacter, ICharacter, GameState } from 'storyScript/Interfaces/storyScript';
import { IGame, Character, ICombatSetup, IEnemy } from './types';

export function Rules(): IRules {
    return {
        setup: {
            playList: {
                // 'createCharacter.mp3': [GameState.CreateCharacter],
                // 'play.mp3': [GameState.Play]
            },

            intro: false,
            gameStart(game) {
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
            fight: (game: IGame, combatRound: ICombatSetup): void => {
                const character = combatRound.characters[0] as Character;
                const enemy = combatRound.enemies[0];
                const damage = game.helpers.rollDice(combatRound[0].item.attack) + character.strength + game.helpers.calculateBonus(character, 'damage');
                game.logToCombatLog('You do ' + damage + ' damage to the ' + enemy.name + '!');
                enemy.currentHitpoints -= damage;

                if (enemy.currentHitpoints <= 0) {
                    game.logToCombatLog('You defeat the ' + enemy.name + '!');
                }

                combatRound.enemies.filter(enemy => { return enemy.currentHitpoints > 0; }).forEach((enemy: IEnemy) => {
                    const damage = game.helpers.rollDice(enemy.attack) + game.helpers.calculateBonus(enemy, 'damage');
                    game.logToCombatLog('The ' + enemy.name + ' does ' + damage + ' damage!');
                    character.currentHitpoints -= damage;
                });
            }
        }
    };
}