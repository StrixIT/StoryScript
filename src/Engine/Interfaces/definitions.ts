import { ILocation } from './location';
import { IAction } from './action';
import { IPerson } from './person';
import { IItem } from './item';
import { IQuest } from './quest';
import { IFeature } from './feature';
import { IEnemy } from './enemy';
import { IMap } from './maps/map';

/**
 * All definitions created for a StoryScript the game.
 */
export interface IDefinitions {
    /**
     * The locations available in the game world.
     */
    locations: (() => ILocation)[];

    /**
     * The available maps of the world.
     */
    maps: (() => IMap)[];
    
    /**
     * The features present in the game world.
     */
    features: (() => IFeature)[];

    /**
     * The enemies present in the game world.
     */
    enemies: (() => IEnemy)[];

    /**
     * The persons roaming the game world.
     */
    persons: (() => IPerson)[];

    /**
     * The items that can be found in the game world.
     */
    items: (() => IItem)[];

    /**
     * The quests the player can pursue in the game world.
     */
    quests: (() => IQuest)[];
}