import {ICompiledLocation} from './compiledLocation';
import {IStatistics} from './statistics';
import {GameState} from './enumerations/gameState';
import {IParty} from './party';

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
    worldProperties: {};
    
    /**
     * The world locations to save.
     */
    world: Record<string, ICompiledLocation>;

    /**
     * The state of the game when saved.
     */
    state: GameState,

    /**
     * The autoplaying audio that was started already.
     */
    playedAudio: []
}