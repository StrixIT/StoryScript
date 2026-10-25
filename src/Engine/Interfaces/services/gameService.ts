import {IDemoMode, IGame, PlayState} from 'storyScript';

export interface IGameService {
    init(): void;

    initDemo(demoConfig: IDemoMode): void;

    startNewGame(characterData: any): void;

    reset(): void;

    restart(skipIntro?: boolean): void;

    loadGame(name: string): void;

    watchPlayState(callBack: (game: IGame, newPlayState: PlayState, oldPlayState: PlayState) => void): void;
}