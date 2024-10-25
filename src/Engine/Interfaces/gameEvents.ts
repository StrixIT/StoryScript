import {IGame} from "storyScript/Interfaces/game.ts";

export interface IGameEvents {
    register(eventName: string, throwWhenAlreadyRegistered: boolean): void;
    subscribe(eventName: string | string[], handler: (game: IGame, eventArguments: {}) => void): void;
    publish(eventName: string, eventArguments: any): void;
    setGame(game: IGame): void
}