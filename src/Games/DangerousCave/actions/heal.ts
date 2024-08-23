import {IGame, IItem} from '../types';
import {ICharacter} from "storyScript/Interfaces/character.ts";

export function Heal(potency: string) {
    return function (game: IGame, character: ICharacter, item: IItem) {
        const healed = game.helpers.rollDice(potency);
        game.activeCharacter.currentHitpoints += healed;
        game.activeCharacter.currentHitpoints = Math.min(game.activeCharacter.currentHitpoints, game.activeCharacter.hitpoints);
    }
}