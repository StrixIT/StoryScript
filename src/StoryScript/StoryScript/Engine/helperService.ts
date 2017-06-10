module StoryScript {
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

module StoryScript {
    export class HelperService implements ng.IServiceProvider, IHelperService {
        private game: IGame;
        private ruleService: IRuleService;

        constructor(game: IGame, ruleService: IRuleService) {
            var self = this;
            self.game = game;
            self.ruleService = ruleService;
        }

        public $get(game: IGame, ruleService: IRuleService): IHelperService {
            var self = this;
            self.game = game;
            self.ruleService = ruleService;

            return {
                rollDice: self.rollDice,
                calculateBonus: self.calculateBonus,
                randomEnemy: self.randomEnemy,
                randomItem: self.randomItem,
                getEnemy: self.getEnemy,
                getItem: self.getItem,
                getPerson: self.getPerson
            };
        }

        getEnemy = (selector: string | (() => IEnemy)): ICompiledEnemy => {
            var self = this;
            var instance = StoryScript.find<IEnemy>(self.game.definitions.enemies, selector, 'enemies', self.game.definitions);
            return instantiateEnemy(instance, self.game.definitions);
        }

        getItem = (selector: string | (() => IItem)) => {
            var self = this;
            return StoryScript.find<IItem>(self.game.definitions.items, selector, 'items', self.game.definitions);
        }

        getPerson = (selector: string | (() => IPerson)): ICompiledPerson => {
            var self = this;
            var instance = StoryScript.find<IPerson>(self.game.definitions.persons, selector, 'persons', self.game.definitions);
            return instantiatePerson(instance, self.game.definitions);
        }

        randomEnemy = (selector?: (enemy: IEnemy) => boolean): ICompiledEnemy => {
            var self = this;
            var instance = StoryScript.random<IEnemy>(self.game.definitions.enemies, 'enemies', self.game.definitions, <(enemy: IEnemy) => boolean>selector);
            return instantiateEnemy(instance, self.game.definitions);
        }

        randomItem = (selector?: string | (() => IItem) | ((item: IItem) => boolean)): IItem => {
            var self = this;
            return StoryScript.random<IItem>(self.game.definitions.items, 'items', self.game.definitions, <(item: IItem) => boolean>selector);
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