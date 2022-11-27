import { GameState } from "./enumerations/gameState";
import { PlayState } from "./enumerations/playState";
import { IGame } from "./game";
import { ILocation } from "./location";

export class StateList implements Record<string, StateListEntry>
{
    [key: string]: (GameState | PlayState | (() => ILocation) | ((game: IGame) => string) | string)[];  
}

export class StateListEntry extends Array<(GameState | PlayState | (() => ILocation) | ((game: IGame) => string) | string)>
{
}