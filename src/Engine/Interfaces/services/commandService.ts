import {ILocation} from "storyScript/Interfaces/location.ts";
import {IPerson} from "storyScript/Interfaces/person.ts";
import {IFeature} from "storyScript/Interfaces/feature.ts";
import {IAction} from "storyScript/Interfaces/action.ts";
import {IDestination} from "storyScript/Interfaces/destination.ts";
import {IBarrier} from "storyScript/Interfaces/barrier.ts";
import {IBarrierAction} from "storyScript/Interfaces/barrierAction.ts";
import {IItem} from "storyScript/Interfaces/item.ts";

export interface ICommandService {
    /**
     * Go to the location specified. If you set the saveProgress flag to false, the game progress will NOT be saved.
     * @param location The location to travel to.
     * @param saveProgress Omit if you want to save the game progress, set to false if you don't want to save.
     */
    go: (location: (() => ILocation) | string, saveProgress?: boolean) => void;

    /**
     * Talk to the specified person at the current location.
     * @param person The person to talk to
     */
    talk: (person: () => IPerson) => void;

    /**
     * Answer to the specified node. If no reply is specified, the default reply will be used.
     * @param node
     * @param reply
     */
    answer: (node: string, reply?: string) => void;

    /**
     * Set the specified combination as the active one.
     * @param combination The combination to set as the active one.
     */
    selectCombination: (combination: string) => void;

    /**
     * Set the specified feature as the currently active tool.
     * @param feature The feature to make the currently active tool.
     */
    setTool: (feature: (() => IFeature) | string) => void;

    /**
     * Try the combination specified on the target, optionally using the tool.
     * @param combination The combination to try.
     * @param target The target to try the combination on.
     * @param tool The tool to use in the combination.
     */
    combine: (combination: string, target: (() => IFeature) | string, tool?: (() => IFeature) | string) => void;

    /**
     * Use the action specified at the current location.
     * @param action The action to use
     */
    useAction: (action: string | [string, IAction]) => void;

    /**
     * Use the barrier action specified on the barrier and destination at the current location.
     * @param destination The destination the barrier is on
     * @param barrier The barrier to use the action on
     * @param action The barrier action to use
     */
    useBarrierAction: (destination: string | IDestination, barrier: string | [string, IBarrier], action: string | [string, IBarrierAction]) => void;

    /**
     * Trade with the specified person or object at the current location.
     * @param trade The person or object to trade with.
     */
    trade: (trade: string | (() => IPerson)) => void;

    /**
     * Buy the specified item from the current trader
     * @param item The item to buy
     */
    buy: (item: (() => IItem)) => void;

    /**
     * Sell the specified item to the current trader
     * @param item The item to sell
     */
    sell: (item: (() => IItem)) => void;
}