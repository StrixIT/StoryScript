import {IGame} from "storyScript/Interfaces/game.ts";

export interface IDataService {
    save<T>(key: string, value: T): void;
    load<T>(key: string): T;
    remove(key: string): void;
    saveGame(game: IGame, name?: string): void;
    getSaveKeys(): string[];
}