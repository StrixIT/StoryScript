﻿namespace StoryScript {
    /**
     * All definitions created for a StoryScript the game.
     */
    export interface IDefinitions {
        /**
         * The locations available in the game world.
         */
        locations: [() => ILocation];

        /**
         * The actions the player can perform in the game world.
         */
        actions: [() => IAction];

        /**
         * The enemies present in the game world.
         */
        enemies: [() => IEnemy];

        /**
         * The persons roaming the game world.
         */
        persons: [() => IPerson];

        /**
         * The items that can be found in the game world.
         */
        items: [() => IItem];

        /**
         * The quests the player can pursue in the game world.
         */
        quests: [() => IQuest];
    }
}