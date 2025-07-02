import {IGame} from "storyScript/Interfaces/game.ts";
import {PlayState} from "storyScript/Interfaces/enumerations/playState.ts";

export interface IGameService {
    init(): void;

    startNewGame(characterData: any): void;

    reset(): void;

    restart(skipIntro?: boolean): void;

    loadGame(name: string): void;

    watchPlayState(callBack: (game: IGame, newPlayState: PlayState, oldPlayState: PlayState) => void): void;
}