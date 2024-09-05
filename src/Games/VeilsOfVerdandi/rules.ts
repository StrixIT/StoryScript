import {IRules} from 'storyScript/Interfaces/storyScript';
import {IGame} from './types';
import {combatRules} from "./combatRules.ts";
import {characterRules} from "./characterRules.ts";
import {explorationRules} from "./explorationRules.ts";

export function Rules(): IRules {
    return {
        setup: {
            numberOfCharacters: 3,
            gameStart: (game: IGame): void => {
                game.party.currency ??= 0;
                game.worldProperties = {
                    currentDay: 1,
                    isDay: true,
                    isNight: false,
                    timeOfDay: 'day',
                    freedFaeries: false,
                    travelCounter: 0
                };
            }
        },

        general: {
            scoreChange: (game: IGame, change: number): boolean => {
                // Implement logic to occur when the score changes. Return true when the character gains a level.
                return false;
            }
        },

        character: characterRules,
        combat: combatRules,
        exploration: explorationRules
    };
}
