module StoryScript.Actions {
    export function Heal(potency: string): (...params) => void {
        return function (game: Game, item: Interfaces.IItem) {
            var healed = game.rollDice(potency);
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