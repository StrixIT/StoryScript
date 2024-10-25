import { IGame } from '../game';
import { PlayState } from '../enumerations/playState';
import {GameState, ICharacter, IGroupableItem, IInterfaceTexts, IItem, ITrade} from '../storyScript';

export interface IGeneralRules {
    /**
     * This function is called when the party's score changes. Return true if you want to toggle the level-up
     * status afterwards.
     * @param game The active game
     * @param change The change in score.
     */
    scoreChange?(game: IGame, change: number): boolean;

    /**
     * This function is called when the game state changes.
     * @param game The active game
     * @param newGameState The new game state
     * @param oldGameState The current game state
     * */
    gameStateChange?(game: IGame, newGameState: GameState, oldGameState: GameState): void;

    /**
     * This function is called when the play state changes.
     * @param game The active game
     * @param newPlayState The new play state
     * @param oldPlayState The current play state
     * */
    playStateChange?(game: IGame, newPlayState: PlayState, oldPlayState: PlayState): void;

    /**
     * Use this function if you want to run additonal logic when determining the player's final score on game end.
     * @param game The game about to be ended
     */
    determineFinalScore?(game: IGame): void;

    /**
     * Use this function to run logic before the game is saved. You can use this to change what is saved as part
     * of a game.
     * @param game The game about to be saved.
     */
    beforeSave?(game: IGame): void;

    /**
     * Use this function to run logic after the game is saved. You can use this to revert changes you made in
     * beforeSave.
     * @param game The game about to be saved.
     */
    afterSave?(game: IGame): void;

    /**
     * Use this function to override the standard way of naming items. This is useful if you want to use a
     * different naming for items that are grouped.
     * @param item The item to get the name for.
     * @param texts The interface texts.
     */
    getItemName?(item: IItem, texts: IInterfaceTexts): string;

    /**
     * Use this function if you want to use special rules for grouping items.
     * @param character The character grouping the items.
     * @param group The item that is the parent for the group.
     * @param item The item to add as a member to the parent.
     */
    canGroupItem?(character: ICharacter, group: IGroupableItem<IItem>, item: IGroupableItem<IItem>): boolean;

    /**
     * Use this function if you want to run code to determine whether an item can be sold to a buyer.
     * @param game The game object
     * @param item The item to sell
     * @param buyer The potential buyer
     */
    canBuyItem?(game: IGame, item: IItem, buyer: ITrade | ICharacter): boolean;
}