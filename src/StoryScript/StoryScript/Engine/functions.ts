module StoryScript.Functions {
    export function rollDice(compositeOrSides: string | number, dieNumber: number = 1, bonus: number = 0): number {
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

    export function calculateBonus(person: { items?: ICollection<IItem>, equipment?: {} }, type: string) {
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

    export function custom<T>(definition: () => T, customData: {}): () => T {
        return (): T => {
            var instance = definition();
            return angular.extend(instance, customData);
        };
    }

    export function equals<T>(entity: T, definition: () => T): boolean {
        return (<any>entity).id === (<any>definition).name;
    }
}