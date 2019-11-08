import { IGame } from '../game';

export interface IGeneralRules {
    /**
     * This function is called when the player's score changes. Return true if you want to toggle the level-up
     * status afterwards.
     * @param game The active game
     * @param change The change in score.
     */
    scoreChange?(game: IGame, change: number): boolean;

    /**
     * Use this function if you want to run additonal logic when determining the player's final score on game end.
     * @param game The game about to be ended
     */
    determineFinalScore?(game: IGame): void;
}