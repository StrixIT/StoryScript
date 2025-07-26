import { ICharacter } from './character';
import { IEnemy } from './enemy';
import { IItem } from './item';

export interface ICombatTurn {
    /**
     * The character for whom this turn is set up.
     */
    character: ICharacter;

    /**
     * The enemies and allies available for targetting to the character this turn.
     */
    targetsAvailable?: (IEnemy | ICharacter)[];

    /**
     * The target selected by the character during the previous turn.
     */
    previousTarget: IEnemy | ICharacter;
    
    /**
     * The target selected by the character this turn.
     */
    target: IEnemy | ICharacter;

    /**
     * True when the target was defeated this turn, false otherwise.
     */
    targetDefeated: boolean;

    /**
     * The items available to the character this turn.
     */
    itemsAvailable?: IItem[];

    /**
     * The item selected by the character during the previous turn.
     */
    previousItem?: IItem;
    
    /**
     * The item selected by the character this turn.
     */
    item?: IItem;
}