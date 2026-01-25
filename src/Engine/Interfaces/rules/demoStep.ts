import {IGame} from "storyScript/Interfaces/game.ts";

export interface IDemoStep {
    /**
     * The action to execute for this step.
     */
    action: (game: IGame) => void;

    /**
     * The amount of time in milliseconds before proceeding to the next step.
     */
    delay: number;
}