namespace StoryScript {
    export interface IHelperService {
        rollDice: (compositeOrSides: string | number, dieNumber?: number, bonus?: number) => number;
        calculateBonus: (person: { items?: ICollection<IItem>, equipment?: {} }, type: string) => number;

        randomEnemy: (selector?: (enemy: IEnemy) => boolean) => ICompiledEnemy;
        randomItem: (selector?: (enemy: IItem) => boolean) => IItem;
        getEnemy: (selector: string | (() => IEnemy)) => ICompiledEnemy;
        getItem: (selector: string | (() => IItem)) => IItem;
        getPerson: (selector: string | (() => IPerson)) => ICompiledPerson;
    }
}

namespace StoryScript {
    export class HelperService implements IHelperService {
        constructor(private _game: IGame, private _rules: IRules) {
        }

        getEnemy = (selector: string | (() => IEnemy)): ICompiledEnemy => {
            var self = this;
            var instance = StoryScript.find<IEnemy>(self._game.definitions.enemies, selector, 'enemies', self._game.definitions);
            return instantiateEnemy(instance, self._game.definitions, self._game, self._rules);
        }

        getItem = (selector: string | (() => IItem)) => {
            var self = this;
            return StoryScript.find<IItem>(self._game.definitions.items, selector, 'items', self._game.definitions);
        }

        getPerson = (selector: string | (() => IPerson)): ICompiledPerson => {
            var self = this;
            var instance = StoryScript.find<IPerson>(self._game.definitions.persons, selector, 'persons', self._game.definitions);
            return instantiatePerson(instance, self._game.definitions, self._game, self._rules);
        }

        randomEnemy = (selector?: (enemy: IEnemy) => boolean): ICompiledEnemy => {
            var self = this;
            var instance = StoryScript.random<IEnemy>(self._game.definitions.enemies, 'enemies', self._game.definitions, <(enemy: IEnemy) => boolean>selector);
            return instantiateEnemy(instance, self._game.definitions, self._game, self._rules);
        }

        randomItem = (selector?: string | (() => IItem) | ((item: IItem) => boolean)): IItem => {
            var self = this;
            return StoryScript.random<IItem>(self._game.definitions.items, 'items', self._game.definitions, <(item: IItem) => boolean>selector);
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