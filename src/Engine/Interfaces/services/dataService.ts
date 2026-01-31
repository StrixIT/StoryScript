import {IGame} from "storyScript/Interfaces/game.ts";

export interface IDataService {
    /**
     * Save the specified object using the save key.
     * @param key The key to use to identity this saved state.
     * @param value The value to save.
     */
    save<T>(key: string, value: T): void;

    /**
     * Loads an object from the specified save key.
     * @param key The key to use to identity the saved state.
     */
    load<T>(key: string): T;

    /**
     * Remove an object from storage using the save key.
     * @param key The key to use to identity the saved state.
     */
    remove(key: string): void;

    /**
     * Save the game state, using the default state save key or the one supplied.
     * @param game The game to save
     * @param name The name of the save game to create.
     */
    saveGame(game: IGame, name?: string): void;

    /**
     * Gets all the keys of the saved states for the game.
     */
    getSaveKeys(): string[];

    /**
     * True if there is a saved game state for the game, false otherwise.
     */
    hasGameState(): boolean;
}