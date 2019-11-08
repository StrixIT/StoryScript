import { ICharacter } from '../../Interfaces/character';
import { IEnemy } from '../../Interfaces/enemy';
import { IItem } from '../../Interfaces/item';
import { IBarrier } from '../../Interfaces/barrier';
import { IDestination } from '../../Interfaces/destination';

export interface IGameService {
    init(): void;
    startNewGame(characterData: any): void;
    levelUp(): ICharacter;
    reset(): void;
    restart(skipIntro?: boolean): void;
    saveGame(name?: string): void;
    getSaveGames(): string[];
    loadGame(name: string): void;
    hasDescription(type: string, item: { id?: string, description?: string }): boolean;
    getDescription(type: string, entity: any, key: string): string;
    setCurrentDescription(type: string, entity: any, key: string): void;
    initCombat(): void;
    fight(enemy: IEnemy, retaliate?: boolean): void;
    useItem(item: IItem): void;
    executeBarrierAction(barrier: IBarrier, destination: IDestination): void;
    getCurrentMusic(): string;
}