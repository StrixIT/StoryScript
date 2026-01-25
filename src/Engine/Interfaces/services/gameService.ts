import {IGame} from "storyScript/Interfaces/game.ts";
import {PlayState} from "storyScript/Interfaces/enumerations/playState.ts";
import {IParty} from "storyScript/Interfaces/party.ts";

export interface IGameService {
    init(): void;

    initDemo(party: IParty): void;

    startNewGame(characterData: any): void;

    reset(): void;

    restart(skipIntro?: boolean): void;

    loadGame(name: string): void;

    watchPlayState(callBack: (game: IGame, newPlayState: PlayState, oldPlayState: PlayState) => void): void;
}