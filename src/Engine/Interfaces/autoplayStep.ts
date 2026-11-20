import {IGame} from 'storyScript';

export interface IAutoplayStep {
    /**
     * The action to execute for this step.
     */
    action: (game: IGame) => Promise<void> | void;

    /**
     * The number of milliseconds to wait before executing this step.
     */
    delay: number;
}