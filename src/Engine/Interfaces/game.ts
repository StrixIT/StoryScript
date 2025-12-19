import {ICharacter} from './character';
import {ICompiledLocation} from './compiledLocation';
import {ScoreEntry} from './scoreEntry';
import {IPerson} from './person';
import {ITrade} from './trade';
import {IFeature} from './feature';
import {ILocation} from './location';
import {IStatistics} from './statistics';
import {IHelpers} from './helpers';
import {ICreateCharacter} from './createCharacter/createCharacter';
import {GameState} from './enumerations/gameState';
import {PlayState} from './enumerations/playState';
import {IParty} from './party';
import {ICombatSetup} from './combatSetup';
import {ICombatTurn} from './combatTurn';
import {ISoundPlayer} from "./soundPlayer.ts";
import { IMap } from './maps/map.ts';
import {IGameCombinations} from "./combinations/gameCombinations.ts";

/**
 * The StoryScript main game object.
 */
export interface IGame {
    /**
     * The sheet to create a character for the game.
     */
    createCharacterSheet?: ICreateCharacter;

    /**
     * The player's adventuring party.
     */
    party: IParty;

    /**
     * The active party character.
     */
    activeCharacter: ICharacter;

    /**
     * All the locations in the game world.
     */
    locations: Record<string, ICompiledLocation> & {
        get?(id?: string | (() => ILocation) | ICompiledLocation): ICompiledLocation;
    };

    /**
     * All the maps of the game world.
     */
    maps: Record<string, IMap> & {
        get?(id?: string | (() => IMap)): IMap;
    };

    /**
     * The location in the game world the player is currently at.
     */
    currentLocation: ICompiledLocation;

    /**
     * The location in the game world the player visited before the current one.
     */
    previousLocation: ICompiledLocation;

    /**
     * The map of the part of the world the player is currently at, if any.
     */
    currentMap?: IMap;
    
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

    combinations: IGameCombinations,

    /**
     * The custom properties for the game world.
     */
    worldProperties: any;

    /**
     * The root UI element. You can use this to interact with the UI if you need to.
     */
    UIRootElement: HTMLElement;

    /**
     * The statistics for this game.
     */
    statistics: IStatistics;

    /**
     * Helper functions to make programming the game easier.
     */
    helpers: IHelpers;

    /**
     * The sound player for the game.
     */
    sounds: ISoundPlayer,

    /**
     * The function executed to change from one location to the next.
     * @param location The location to go to
     * @param travel True if the player is traveling, false if he gets to the next location because of some other event.
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
     * The setup for the next combat round. This object is used to track
     * which character attacks which enemy using what item or weapon.
     */
    combat: ICombatSetup<ICombatTurn>;
}