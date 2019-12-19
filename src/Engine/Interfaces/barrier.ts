import { IKey } from './key';
import { IBarrierAction } from './barrierAction';
import { ICombinable } from './combinations/combinable';

/**
 * The base properties for barriers that block a player from moving between one world location to the next.
 */
export interface IBarrier extends ICombinable {
    /**
     * The actions the player can perform on the barrier (e.g. inspect or open).
     */
    actions?: IBarrierAction[];

    /**
     * The key to use to remove this barrier.
     */
    key?: (() => IKey) | string;
}