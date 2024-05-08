import { ICharacter } from './character';
import { IEnemy } from './enemy';
import { IItem } from './item';

export interface ICombatTurn {
    /**
     * The character for whom this turn is set up.
     */
    character: ICharacter;

    /**
     * The targets available to the character this turn.
     */
    targetsAvailable?: IEnemy[];

    /**
     * The target selected by the character this turn.
     */
    target: IEnemy;

    /**
     * The items available to the character this turn.
     */
    itemsAvailable?: IItem[];

    /**
     * The item selected by the character this turn.
     */
    item?: IItem;
}