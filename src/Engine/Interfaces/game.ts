import { IDefinitions } from './definitions';
import { ICharacter } from './character';
import { ILocationCollection } from './locationCollection';
import { ICompiledLocation } from './compiledLocation';
import { ScoreEntry } from './scoreEntry';
import { IPerson } from './person';
import { ITrade } from './trade';
import { IFeature } from './feature';
import { IDynamicStyle } from './dynamicStyle';
import { ILocation } from './location';
import { IEnemy } from './enemy';
import { IStatistics } from './statistics';
import { IHelpers } from './helpers';
import { ICreateCharacter } from './createCharacter/createCharacter';
import { GameState } from './enumerations/gameState';
import { PlayState } from './enumerations/playState';
import { IActiveCombination } from './combinations/activeCombination';
import { ICombinable } from './combinations/combinable';

/**
 * The StoryScript main game object.
 */
export interface IGame {
    /**
     * All the definitions created for this game.
     */
    definitions: IDefinitions;

    /**
     * The sheet to create a character for the game.
     */
    createCharacterSheet?: ICreateCharacter;

    /**
     * The player character.
     */
    character: ICharacter;

    /**
     * All the locations in the game world.
     */
    locations: ILocationCollection;

    /**
     * The location in the game world the player is currently at.
     */
    currentLocation: ICompiledLocation;

    /**
     * The location in the game world the player visited before the current one.
     */
    previousLocation: ICompiledLocation;

    /**
     * The high score log for the game.
     */
    highScores: ScoreEntry[];

    /**
     * A log containing descriptions of player actions during the game. 
     */
    actionLog: string[];

    /**
     * A log containing descriptions of player actions during combat in the game. 
     */
    combatLog: string[];

    /**
     * The current state of the game.
     */
    state: GameState;

    /**
     * The current state of play of the game.
     */
    playState: PlayState;

    /**
     * The person the player is currently interacting with.
     */
    person: IPerson;

    /**
     * The trade object or person the player is currently trading with.
     */
    trade: ITrade;

    /**
     * The description currently shown to the player.
     */
    currentDescription: {
        /**
         * The description title.
         */
        title: string;

        /**
         * The type of the entity for which the description is shown.
         */
        type: string;

        /**
         * The feature of which to show the description.
         */
        item: IFeature;
    };

    /**
     * True if a game is being loaded, false otherwise.
     */
    loading: boolean;

    combinations: {
        /**
         * Holds the currently selected combination action during rum-time. This will be undefined or null when the player
         * is not trying a combination.
         */
        activeCombination: IActiveCombination,
    
        /**
         * The result from the last attempted combination.
         */
        combinationResult:
        {
            /**
             * Indicates whether the combination is done.
             */
            done: boolean;

            /**
             * The combination result text.
             */
            text: string;

            /**
             * The features to remove.
             */
            featuresToRemove: string[];

            /**
             * Resets the combination result.
             */
            reset(): void;
        }

        /**
         * Get the class name to use for the current combine state.
         * @param tool The tool of the combination. Pass this in to get the class name for the tool element. Pass nothing to
         * get the class name for the tool button bar.
         */
        getCombineClass(tool: ICombinable): string;

        /**
         * Try the combination the player has created.
         * @param target The target of the combination
         */
        tryCombine(target: ICombinable): boolean;
    }

    /**
     * The custom properties for the game world.
     */
    worldProperties: any;

    /**
     * Add styles that should be applied to the interface dynamically here.
     */
    dynamicStyles: IDynamicStyle[];

    /**
     * The statistics for this game.
     */
    statistics: IStatistics;

    /**
     * Helper functions to make programming the game easier.
     */
    helpers: IHelpers;

    sounds: {
        startMusic(): void;
        stopMusic(): void;
        playSound(fileName: string): void;
        soundQueue: string[];
    }

    /**
     * The function executed to change from one location to the next.
     * @param location The location to go to
     * @param travel True if the player is travelling, false if he gets to the next location because of some other event.
     */
    changeLocation(location?: string | (() => ILocation), travel?: boolean): void;

    /**
     * Logs a message to the location log.
     * @param message The message to log
     */
    logToLocationLog(message: string): void;

    /**
     * Logs a message to the action log.
     * @param message The message to log
     */
    logToActionLog(message: string): void;

    /**
     * Logs a message to the combat log.
     * @param message The message to log
     */
    logToCombatLog(message: string): void;

    /**
     * The function executed when the player attacks an enemy.
     * @param enemy The enemy to attack
     * @param boolean True if the enemy can retaliate (default), false otherwise
     */
    fight(enemy: IEnemy, retaliate?: boolean): void;
}