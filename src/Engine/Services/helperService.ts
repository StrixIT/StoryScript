namespace StoryScript {
    export interface IHelperService {
        /**
         * Roll a number of dice to get a number.
         * @param compositeOrSides The number and type of dice (e.g. 3d6) or the number of sides of the dice (e.g.) 6
         * @param dieNumber The number of dice, if not using the composite option
         * @param bonus The bonus to add to the result.
         */
        rollDice(compositeOrSides: string | number, dieNumber?: number, bonus?: number): number;

        /**
         * Calculate the bonus the character is granted by the items he is carrying.
         * @param person The player character or the person to calculate the bonus for.
         * @param type The player attribute to get the bonus for (e.g. attack)
         */
        calculateBonus(person: { items?: ICollection<IItem>, equipment?: {} }, type: string): number;

        /**
         * Get a random enemy to add to the game.
         * @param selector A selector function to limit the list of enemies that can be returned at random (for example a function that excludes ghosts)
         */
        randomEnemy(selector?: (enemy: IEnemy) => boolean): IEnemy;

        /**
         * Get a random item to add to the game.
         * @param selector A selector function to limit the list of items that can be returned at random (for example a function that excludes magic items)
         */
        randomItem(selector?: (enemy: IItem) => boolean): IItem;

        /**
         * Gets a specific type of item to add to the game.
         * @param selector The type of the item to add, as a string or a function name (e.g. 'Dagger' or MyNewGame.Dagger)
         */        
        getItem(selector: string | (() => IItem)): IItem;
    }
}

namespace StoryScript {
    export class HelperService implements IHelperService {
        constructor(private _game: IGame, private _rules: IRules) {
        }

        randomEnemy = (selector?: (enemy: IEnemy) => boolean): IEnemy => {
            var self = this;
            return random<IEnemy>('enemies', self._game.definitions, <(enemy: IEnemy) => boolean>selector);
        }

        randomItem = (selector?: string | (() => IItem) | ((item: IItem) => boolean)): IItem => {
            var self = this;
            return random<IItem>('items', self._game.definitions, <(item: IItem) => boolean>selector);
        }
     
        getItem = (selector: string): IItem => {
            var self = this;
            return find<IItem>(selector, 'items', self._game.definitions);
        }

        rollDice = (compositeOrSides: string | number, dieNumber: number = 1, bonus: number = 0): number => {
            var sides = <number>compositeOrSides;

            if (typeof compositeOrSides !== 'number') {
                //'xdy+/-z'
                var positiveModifier = compositeOrSides.indexOf('+') > -1;
                var splitResult = compositeOrSides.split('d');
                dieNumber = parseInt(splitResult[0]);
                splitResult = (positiveModifier ? splitResult[1].split('+') : splitResult[1].split('-'));
                splitResult.forEach(e => e.trim());
                sides = parseInt(splitResult[0]);
                bonus = parseInt(splitResult[1]);
                bonus = isNaN(bonus) ? 0 : positiveModifier ? bonus : bonus * -1;
            }

            var result = 0;

            for (var i = 0; i < dieNumber; i++) {
                result += Math.floor(Math.random() * sides + 1);
            }

            result += bonus;
            return result;
        }

        calculateBonus = (person: { items?: ICollection<IItem>, equipment?: {} }, type: string) => {
            var bonus = 0;

            if (person.equipment) {
                for (var n in person.equipment) {
                    var item = person.equipment[n];

                    if (item && item.bonuses && item.bonuses[type]) {
                        bonus += item.bonuses[type];
                    }
                };
            }
            else {
                if (person.items) {
                    person.items.forEach(function (item) {
                        if (item && item.bonuses && item.bonuses[type]) {
                            bonus += item.bonuses[type];
                        }
                    });
                }
            }

            return bonus;
        }
    }
}