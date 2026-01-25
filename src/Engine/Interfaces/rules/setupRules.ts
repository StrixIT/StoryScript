import { IGame } from '../game';
import { ICombinationAction } from '../combinations/combinationAction';
import { StateList } from '../stateList';
import {IDemoMode} from "storyScript/Interfaces/rules/demoMode.ts";
import {ServiceFactory} from "storyScript/ServiceFactory.ts";
import {ITitleScreen} from "storyScript/Interfaces/rules/titleScreen.ts";

export interface ISetupRules {
    /**
     * Set this to a positive value greater than 1 to allow the player to create a party of more than
     * one character.
     */
    numberOfCharacters?: number;

    /**
     * Set this if you want to use a title screen.
     */
    titleScreen?: ITitleScreen;
    
    /**
     * Set this to true if you want to show an intro screen when the game starts.
     */
    intro?: boolean;

    /**
     * Run custom code to prepare the game before it begins. NOTE: this also runs when
     * the browser reloads. If you want to run code only on the start of a new game, use
     * gameStart instead.
     * @param game The game about to be started
     */
    initGame?(game: IGame): void;

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
        playList: {
            Using GameState: 'play.mp4': [GameState.Play].
            For multiple play states: 'play.mp4': [GameState.Intro, GameState.Play].
            Using PlayState: 'combat.mp4': [PlayState.Combat].
            Using Locations: 'start.mp4': [Start].
            Using a custom function: '': [game => string] (the string value returned from the function should be the music file).
        }
     */
    playList?: StateList;

    /**
     * When you want to fade out music before starting a new piece, set this interval. The interval is in miliseconds, so specify
     * a sufficiently large value (e.g. 250). The volume will be reduced by 10% each interval, and the new music starts when the
     * volume of the current music reaches 0.
     */
    fadeMusicInterval?: number;
}