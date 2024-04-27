import { ICollection } from './collection';
import { ICompiledLocation } from './compiledLocation';
import { ICharacter } from './character';
import { IStatistics } from './statistics';
import { GameState } from './enumerations/gameState';
import { IParty } from './party';

/**
 * An object to save the game state.
 */
export interface ISaveGame {
    /**
     * The save game name.
     */
    name?: string;

    /**
     * The party to save
     */
    party: IParty;

    /**
     * The statistics to save.
     */
    statistics: IStatistics;

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