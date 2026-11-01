import {ICharacter, ICombatTurn, ICombatWinnings, IEnemy} from 'storyScript';

export interface ICombatSetup<T extends ICombatTurn> extends Array<T> {
    roundHeader: string;
    noActionText: string;
    round: number;
    characters: ICharacter[];
    enemies: IEnemy[];
    winnings: ICombatWinnings
}