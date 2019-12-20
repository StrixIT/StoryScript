import { IRules, ICombinationAction, ICreateCharacter, ICharacter } from 'storyScript/Interfaces/storyScript';
import { Constants } from './constants';
import { IGame, Character, IEnemy } from './types';

export function Rules(): IRules {
    return {
        setup: {
            getCombinationActions: (): ICombinationAction[] => {
                return [
                    {
                        text: Constants.WALK,
                        preposition: 'to',
                        requiresTool: false
                    },
                    {
                        text: Constants.USE,
                        preposition: 'on'
                    },
                    {
                        text: Constants.TOUCH,
                        requiresTool: false
                    },
                    {
                        text: Constants.LOOKAT,
                        preposition: 'at',
                        requiresTool: false,
                        failText: (game, target, tool): string => { 
                            return 'You look at the ' + target.name + '. There is nothing special about it';
                        }
                    }
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