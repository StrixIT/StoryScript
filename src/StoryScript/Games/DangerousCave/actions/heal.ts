module DangerousCave.Actions {
    export function Heal(potency: string): (...params) => void {
        return function (game: IGame, item: IItem) {
            var healed = game.helpers.rollDice(potency);
            game.character.currentHitpoints += healed;

            if (item.charges) {
                item.charges--;
            }

            if (!item.charges) {
                game.character.items.remove(item);
            }
        }
    }
}