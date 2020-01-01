import { IGame } from '../game';
import { GameState } from '../enumerations/gameState';
import { PlayState } from '../enumerations/playState';
import { ICombinationAction } from '../combinations/combinationAction';
import { ILocation } from '../location';

export interface ISetupRules {
    /**
     * Set this to true if you want to show an automatic destination back to the location the player
     * visited previously. Used for testing only. This setting is removed when publishing the game.
     */
    autoBackButton?: boolean;

    /**
     * Set this to true if you want to show an intro screen when the game starts.
     */
    intro?: boolean;

    /**
     * Run custom code to prepare the game before it begins, e.g. adding game-specific world properties to it.
     * @param game The game about to be started
     */
    setupGame?(game: IGame): void;

    /**
     * If you want to use combinations in your game, use this function to return the combination actions that
     * your game uses (e.g. 'Look at', 'Use', etc.).
     */
    getCombinationActions?(): ICombinationAction[];

    /**
     * Run custom code to prepare the game before entering the start location, e.g. adding game-specific
     * world properties to it.
     * @param game The game about to be started
     */
    gameStart?(game: IGame): void;

    /**
     * Run custom code to prepare the game before resuming a game when loading a game.
     * @param game The game about to be loaded
     */
    continueGame?(game: IGame): void;

    /**
     * When you want to play a music file when the game is in a certain state, use this list. Use it like this:
        playList: [
            Using GameState: [GameState.Play, 'play.mp4'].
            Using PlayState: [PlayState.Combat, 'combat.mp4'].
            Using Locations: [Start, 'start.mp4'].
            Using a custom function: [() => string, ''] (the string value returned from the function should be the music file).
        ]
     */
    playList?: (GameState | PlayState | (() => ILocation) | ((game:IGame) => string) | string)[][];
}