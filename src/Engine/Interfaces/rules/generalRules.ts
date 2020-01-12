import { IGame } from '../game';
import { PlayState } from '../enumerations/playState';

export interface IGeneralRules {
    /**
     * This function is called when the player's score changes. Return true if you want to toggle the level-up
     * status afterwards.
     * @param game The active game
     * @param change The change in score.
     */
    scoreChange?(game: IGame, change: number): boolean;

    /**
     * This function is called when the play state changes.
     * @param game The active game
     * @param newPlayState The new play state
     * @param oldPlayState The current play state
     * */
    playStateChange?(game: IGame, newPlayState: PlayState, oldPlayState: PlayState): void;

    /**
     * Use this function if you want to run additonal logic when determining the player's final score on game end.
     * @param game The game about to be ended
     */
    determineFinalScore?(game: IGame): void;

    /**
     * Use this function to run logic before the game is saved. You can use this to change what is saved as part
     * of a game.
     * @param game The game about to be saved.
     */
    beforeSave?(game: IGame): void;

    /**
     * Use this function to run logic right after the game is loaded. you can use this in combination with the
     * beforeSave hook to change what is saved and loaded as part of a game.
     * @param game The game about to be saved.
     */
    afterLoad?(game: IGame): void;
}