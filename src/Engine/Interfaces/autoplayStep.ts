import {IGame} from "storyScript/Interfaces/game.ts";

export interface IAutoplayStep {
    /**
     * The action to execute for this step.
     */
    action: (game: IGame) => void;

    /**
     * The number of milliseconds to wait before executing this step.
     */
    delay: number;
}