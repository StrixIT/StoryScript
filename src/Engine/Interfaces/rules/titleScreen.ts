import {IDemoMode} from "storyScript/Interfaces/rules/demoMode.ts";

export interface ITitleScreen {
    /**
     * Set this flag to true if you want to show a title screen, false otherwise.
     */
    showTitleScreen: boolean;

    /**
     * Set this function to get the demo configuration if you want to autoplay a demo game.
     */
    getDemoMode?: () => IDemoMode;

    /**
     * The transition time to use to fade to the game demo from the title screen, and back out when the demo has run.
     * Use the CSS format, e.g. '.1' or '1'.
     */
    transitionDelay?: string;
}