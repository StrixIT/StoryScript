import { IItem, IGame } from '../types';

export function Heal(potency: string) {
    return function (game: IGame, item: IItem) {
        var healed = game.helpers.rollDice(potency);
        game.character.currentHitpoints += healed;
        game.character.currentHitpoints = Math.min(game.character.currentHitpoints, game.character.hitpoints);
    }
}