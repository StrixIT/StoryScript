import { IEnemy } from './enemy';
import { IItem } from './item';

export interface ICombatSetup {
    characterName: string;

    target: IEnemy;

    weapon?: IItem;

    item?: IItem;
}