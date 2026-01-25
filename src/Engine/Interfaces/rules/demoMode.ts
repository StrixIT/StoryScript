import {IDemoStep} from "storyScript/Interfaces/rules/demoStep.ts";

export interface IDemoMode {
    /**
     * The transition time to use to fade to the game.
     */
    startTransitionDelay?: string;
    
    /**
     * The number of milliseconds to wait before starting the game demo.
     */
    startInterval: number;

    /**
     * The steps to play for your game's demo.
     */
    steps: IDemoStep[];

    /**
     * True if the game demo is running, false otherwise.
     */
    runningDemo: boolean;

    /**
     * True if you want to show the text that demo mode is in progress, false otherwise.
     */
    showDemoPlayText?: boolean;
}