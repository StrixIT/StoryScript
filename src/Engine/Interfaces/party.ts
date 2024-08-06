import { ICharacter } from "./character";
import { ICollection } from "./collection";
import { IQuest } from "./quest";

export interface IParty {
    /**
     * The name of the party.
     */
    name?: string;

    /**
     * The members of the party.
     */
    characters: ICollection<ICharacter>;

    /**
     * The amount of credits the party has, in whatever form.
     */
    currency?: number;

    /**
     * All the quests the party has accepted, both active and complete.
     */
    quests?: ICollection<IQuest>;

    /**
     * The number of points scored by the party so far. This property should be managed in your game rules. The score will
     * be used to determine the party's ranking in the high-score list on game end.
     */
    score?: number;

    /**
     * The id of the location in the game world the party is currently at.
     */
    currentLocationId?: string;

    /**
     * The id of the location in the game world the party visited before the current one.
     */
    previousLocationId?: string;
}