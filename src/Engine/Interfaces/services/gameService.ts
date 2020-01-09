import { ICharacter } from '../../Interfaces/character';
import { IEnemy } from '../../Interfaces/enemy';
import { IItem } from '../../Interfaces/item';
import { IBarrier } from '../../Interfaces/barrier';
import { IDestination } from '../../Interfaces/destination';
import { IBarrierAction } from '../barrierAction';
import { IGame } from '../game';
import { PlayState } from '../enumerations/playState';

export interface IGameService {
    init(): void;
    startNewGame(characterData: any): void;
    levelUp(): ICharacter;
    reset(): void;
    restart(skipIntro?: boolean): void;
    saveGame(name?: string): void;
    getSaveGames(): string[];
    loadGame(name: string): void;
    hasDescription(entity: { id?: string, description?: string }): boolean;
    initCombat(): void;
    fight(enemy: IEnemy, retaliate?: boolean): void;
    useItem(item: IItem): void;
    executeBarrierAction(barrier: IBarrier, action: IBarrierAction, destination: IDestination): void;
    getCurrentMusic(): string;
    watchPlayState(callBack: (game: IGame, newPlayState: PlayState, oldPlayState: PlayState) => void);
}