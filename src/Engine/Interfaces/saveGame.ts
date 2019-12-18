import { ICollection } from './collection';
import { ICompiledLocation } from './compiledLocation';
import { ICharacter } from './character';
import { IStatistics } from './statistics';
import { GameState } from './enumerations/gameState';

/**
 * An object to save the game state.
 */
export interface ISaveGame {
    /**
     * The save game name.
     */
    name?: string;

    /**
     * The character to save
     */
    character: ICharacter;

    /**
     * The statistics to save.
     */
    statistics: IStatistics;

    /**
     * The id of the location the player is currently at.
     */
    location: string;

    /**
     * The id of the location the player visited previous to the current one.
     */
    previousLocation: string;

    /**
     * The properties of the world to save.
     */
    worldProperties: any;

    /**
     * The world locations to save.
     */
    world: ICollection<ICompiledLocation>;

    /**
     * The state of the game when saved.
     */
    state: GameState
}