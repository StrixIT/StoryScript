import {IDemoMode} from "storyScript/Interfaces/rules/demoMode.ts";
import {IAutoplayStep} from "storyScript/Interfaces/autoplayStep.ts";

export interface IAutoplayService {
    
    /**
     * Start autoplay using the steps specified.
     * @param steps The steps to autoplay.
     * @param callback If needed, call a function when autoplay completes.
     */
    start: (steps: IAutoplayStep[], callback?: () => void) => void;

    /**
     * Stops autoplay in progress.
     */
    stop: () => void;

    /**
     * Start autoplaying the game in demo mode using the configuration specified.
     * @param demoConfig The demo mode configuration.
     * @param restartCallback Call a function to restart the demo when it completes.
     */
    startDemoMode: (demoConfig: IDemoMode, restartCallback: () => void) => void;
}