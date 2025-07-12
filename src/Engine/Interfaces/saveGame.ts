import {ICompiledLocation} from './compiledLocation';
import {IStatistics} from './statistics';
import {IParty} from './party';
import { IMap } from './maps/map';

/**
 * An object to save the game state.
 */
export interface ISaveGame {
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
     * The world maps to save.
     */
    maps: Record<string, IMap>;

    /**
     * The autoplaying audio that was started already.
     */
    playedAudio: []
}