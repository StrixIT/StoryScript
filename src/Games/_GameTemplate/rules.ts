import {CombatEventType, IActor, ICharacter, ICreateCharacter, IItem, IRules} from 'storyScript';
import {Character, ICombatSetup, IEnemy, IGame} from './types';

export function Rules(): IRules {
    return {
        setup: {},

        combinations: {
            combinationActions: [
                // Add combination action names here if you want to use this feature.
            ]
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

        exploration: {},

        combat: {
            fight: async (game: IGame, 
                          combatRound: ICombatSetup, 
                          applyCombatEffects: (game: IGame, 
                                               type: CombatEventType,
                                               delay?: number, 
                                               participant?: IActor, 
                                               target?: IActor,
                                               combatItem?: IItem,
                                               additionalEffects?: Promise<void>[]) => Promise<void[]>): Promise<void> => {

                // Implement character attack here. Apply combat effects when you use them. E.g.
                // await applyCombatEffects(game, CombatEventType.Attack);
                
                game.currentLocation.enemies.filter((enemy: IEnemy) => {
                    return enemy.currentHitpoints > 0;
                }).forEach(enemy => {
                    // Implement monster attack here. Apply combat effects when you use them. E.g.
                    // await applyCombatEffects(game, CombatEventType.Attack);
                });
            }
        },
    };
}