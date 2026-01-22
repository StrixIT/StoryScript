import {IGame} from "storyScript/Interfaces/game.ts";

export interface ICombinationRules {
    success?: (game: IGame) => void;
}