import { IRules, ICharacter, ICreateCharacter, ICombinationAction, GameState } from 'storyScript/Interfaces/storyScript';
import { IGame, IEnemy, Character } from './types';

export function Rules(): IRules {
    return {
        setup: {
            getCombinationActions: (): ICombinationAction[] => {
                return [
                    // Add combination action names here if you want to use this feature.
                ];
            },playList:[
                [GameState.Play,'underwater.mp3']
            ],autoBackButton: false
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

            getCreateCharacterSheet: (): ICreateCharacter => {
                return {
                    steps: [
                        // Add the character creation steps here, if you want to use character creation.
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