import {IDemoMode, IGame, PlayState} from 'storyScript';

export interface IGameService {
    init(): Promise<void>;

    initDemo(demoConfig: IDemoMode): Promise<void>;

    startNewGame(characterData: any): Promise<void>;

    reset(): Promise<void>;

    restart(skipIntro?: boolean): Promise<void>;

    loadGame(name: string): void;

    watchPlayState(callBack: (game: IGame, newPlayState: PlayState, oldPlayState: PlayState) => void): void;
}