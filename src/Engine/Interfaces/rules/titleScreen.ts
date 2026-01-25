import {ServiceFactory} from "storyScript/ServiceFactory.ts";
import {IDemoMode} from "storyScript/Interfaces/rules/demoMode.ts";
import {IParty} from "storyScript/Interfaces/party.ts";

export interface ITitleScreen {
    showTitleScreen: boolean;

    /**
     * The party to use to play the demo game.
     */
    demoParty?: IParty;

    /**
     * The function to get the demo mode for the game.
     */
    getDemoMode?: (serviceFactory: ServiceFactory) => IDemoMode;
}