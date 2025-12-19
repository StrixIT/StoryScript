import {IGameEvents} from "./Interfaces/gameEvents.ts";
import { IGame } from "./Interfaces/storyScript.ts";

export class GameEvents implements IGameEvents {
    private readonly _eventHandlers = new Map<string, ((game: IGame, eventArguments: any) => void)[]>();
    private _game: IGame;
    
    register = (eventName: string, throwWhenAlreadyRegistered: boolean = true): void => {
        if (this._eventHandlers.has(eventName)) {
            if (throwWhenAlreadyRegistered) {
                throw new Error(`Event ${eventName} has already been registered!`);
            }
            
            return;
        }
        
        this._eventHandlers.set(eventName, []);
    }
    subscribe = (eventName: string | string[], handler: (game: IGame, eventArguments: any) => void, throwIfUnknown?: boolean): void => {
        const eventNames = Array.isArray(eventName) ? eventName : [eventName];
        
        eventNames.forEach(e => {
            if (!this._eventHandlers.has(e)) {
                if (throwIfUnknown === undefined || throwIfUnknown) {
                    throw new Error(`Event ${e} has not been registered!`);
                }
                else {
                    this._eventHandlers.set(e, []);
                }
            }
            
            const handlers = this._eventHandlers.get(e);
            handlers.push(handler);
        });
    }
    
    publish = (eventName: string, eventData: any): void => {
        if (!this._eventHandlers.has(eventName)) {
            throw new Error(`Event ${eventName} has not been registered!`);
        }

        const handlers = this._eventHandlers.get(eventName);
        
        if (this._game) {
            handlers.forEach(handler => handler(this._game, eventData));
        } else {
            console.log(`setGame has not been called for gameEvents, or it was called without passing in a game object!`);
        }
    }
    
    setGame = (game: IGame): void => {
        this._game = game;
    }
}

export const gameEvents = new GameEvents();