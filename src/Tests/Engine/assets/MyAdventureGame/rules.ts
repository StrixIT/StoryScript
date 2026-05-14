import {GameState, ICharacter, ICombinable, ICreateCharacter, IRules} from 'storyScript/Interfaces/storyScript';
import {Combinations} from './combinations';
import {Character, ICombatSetup, IEnemy, IGame} from './types';
import {IActiveCombination} from "storyScript/Interfaces/combinations/activeCombination.ts";
import {getDemoMode} from "./demoMode.ts";

export function Rules(): IRules {
    return {
        setup: {
            // titleScreen: {
            //     showTitleScreen: true,
            //     transitionDelay: '2',
            //     getDemoMode: getDemoMode
            // },
            playList: {
                'Contemplate_the_stars.mp3': [GameState.Play]
            },
            initGame(game: IGame) {
                game.worldProperties.type = 'Visual'; // Set to 'Text' or 'Visual' to switch between modes.
            }
        },

        combinations: {
            combinationActions: [
                {
                    text: Combinations.WALK,
                    preposition: 'to',
                    requiresTool: false,
                    picture: 'walk.png'
                },
                {
                    text: Combinations.USE,
                    preposition: 'on',
                    picture: 'use.png'
                },
                {
                    text: Combinations.TOUCH,
                    requiresTool: false,
                    picture: 'touch.png'
                },
                {
                    text: Combinations.LOOKAT,
                    preposition: 'at',
                    requiresTool: false,
                    // isDefault: true,
                    picture: 'look.png',
                    failText: (game: IGame, target: ICombinable, tool: ICombinable): string => {
                        return 'You look at the ' + target.name + '. There is nothing special about it';
                    }
                }
            ],
            success: (game: IGame, combination: IActiveCombination) => {
                if (combination.selectedCombinationAction.text != Combinations.WALK) {
                    game.sounds.playSound('kings_quest_6_ding.mp3');
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
            fight: (game: IGame, combatSetup: ICombatSetup, retaliate?: boolean) => {
                retaliate = retaliate === undefined ? true : retaliate;

                // Implement character attack here.

                if (retaliate) {
                    game.currentLocation.enemies.filter((enemy: IEnemy) => {
                        return enemy.currentHitpoints > 0;
                    }).forEach(function (enemy) {
                        // Implement monster attack here
                    });
                }
            }
        }
    };
}