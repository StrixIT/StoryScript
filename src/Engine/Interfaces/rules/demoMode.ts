import {IParty} from "testGame/interfaces/party.ts";
import {IAutoplayStep} from "storyScript/Interfaces/autoplayStep.ts";

export interface IDemoMode {
    /**
     * The number of milliseconds to wait before starting the game demo.
     */
    startDelay: number;

    /**
     * The party to use when playing the demo.
     */
    party: IParty;

    /**
     * The steps to play during the demo.
     */
    steps: IAutoplayStep[];
}