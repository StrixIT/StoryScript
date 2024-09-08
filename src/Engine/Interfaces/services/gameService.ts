import { ICharacter } from '../../Interfaces/character';
import { IEnemy } from '../../Interfaces/enemy';
import { IItem } from '../../Interfaces/item';
import { IBarrier } from '../../Interfaces/barrier';
import { IDestination } from '../../Interfaces/destination';
import { IBarrierAction } from '../barrierAction';
import { IGame } from '../game';
import { GameState } from '../enumerations/gameState';
import { PlayState } from '../enumerations/playState';
import { ICombatSetup } from '../combatSetup';
import { ICombatTurn } from '../combatTurn';

export interface IGameService {
    init(): void;
    startNewGame(characterData: any): void;
    levelUp(character: ICharacter): ICharacter;
    reset(): void;
    restart(skipIntro?: boolean): void;
    getSaveGames(): string[];
    loadGame(name: string): void;
    hasDescription(entity: { id?: string, description?: string }): boolean;
    executeBarrierAction(barrier: [string, IBarrier], action: [string, IBarrierAction], destination: IDestination): void;
    getCurrentMusic(): string;
    watchGameState(callBack: (game: IGame, newGameState: GameState, oldGameState: GameState) => void): void;
    watchPlayState(callBack: (game: IGame, newPlayState: PlayState, oldPlayState: PlayState) => void): void;
    saveGame(name?: string): void;
}