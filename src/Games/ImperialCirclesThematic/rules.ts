import { IRules, ICreateCharacter, ICharacter, ICombinationAction, GameState, ICombinable } from 'storyScript/Interfaces/storyScript';
import { IGame, IEnemy, Character, ICombatSetup } from './types';
import {Combinations} from './combinations';

export function Rules(): IRules {
    return {
        setup: {
			initGame(game: IGame) {
            game.worldProperties.type = 'Text'; // Set to 'Text' or 'Visual' to switch between modes.
             },
            playList: {
                'Contemplate_the_stars.mp3': [GameState.Play]
            },
            getCombinationActions: (): ICombinationAction[] => {
	return [
		{
			text: Combinations.USE,
			preposition: '',
			requiresTool: false,
			failText: (game: IGame, target: ICombinable, tool: ICombinable): string => { 
			    return 'Sorry, but you cannot read ' + target.name + '. Look for a book instead!';
            }
		},
		{
			text: Combinations.LOOKAT,
			preposition: '',
			requiresTool: false,
			failText: (game: IGame, target: ICombinable, tool: ICombinable): string => { 
			    return 'Sorry, but you cannot meet ' + target.name + '. It is not a person!';
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

        exploration: {
            
        },

        combat: {     
            fight: (game: IGame, combatSetup: ICombatSetup, retaliate?: boolean) => {
                retaliate = retaliate == undefined ? true : retaliate;

                // Implement character attack here.

                if (retaliate) {
                    game.currentLocation.activeEnemies.filter((enemy: IEnemy) => { return enemy.currentHitpoints > 0; }).forEach(enemy => {
                        // Implement monster attack here
                    });
                }
            }
        }
    };
}
