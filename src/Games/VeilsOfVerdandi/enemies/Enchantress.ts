import {Enemy, IGame} from "../types";

export function Enchantress() {
    return Enemy({
        name: 'The Enchantress',
        hitpoints: 20,
        damage: '1d8',
        currency: 5,
        onDefeat(game: IGame) {
            // Todo: won the game!
        }
    });
}