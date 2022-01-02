import { IHelpers } from '../Interfaces/helpers';
import { IEnemy } from '../Interfaces/enemy';
import { IItem } from '../Interfaces/item';
import { ICollection } from '../Interfaces/collection';
import { IDefinitions } from '../Interfaces/definitions';
import { IGame } from '../Interfaces/game';
import { random } from '../utilities';
import { compareString } from '../globals';

export class HelperService implements IHelpers {
    constructor(private _game: IGame) {
    }

    randomEnemy = (selector?: (enemy: IEnemy) => boolean): IEnemy => random<IEnemy>('enemies', this._game.definitions, <(enemy: IEnemy) => boolean>selector);

    randomItem = (selector?: (item: IItem) => boolean): IItem => random<IItem>('items', this._game.definitions, <(item: IItem) => boolean>selector);
    
    getItem = (selector: string): IItem => this.find<IItem>(selector, 'items', this._game.definitions);

    getEnemy = (selector: string): IEnemy => this.find<IEnemy>(selector, 'enemies', this._game.definitions);

    rollDice = (compositeOrSides: string | number, dieNumber: number = 1, bonus: number = 0): number => {
        var sides = <number>compositeOrSides;

        if (typeof compositeOrSides !== 'number') {
            var splitResult = compositeOrSides.split(/d/i);

            if (splitResult.length === 1) {
                sides = parseInt(splitResult[0]);
            }
            else {
                //'xdy+/-z'
                var positiveModifier = compositeOrSides.indexOf('+') > -1;
                dieNumber = parseInt(splitResult[0]);
                splitResult = (positiveModifier ? splitResult[1].split('+') : splitResult[1].split('-'));
                splitResult.forEach(e => e.trim());
                sides = parseInt(splitResult[0]);
                bonus = parseInt(splitResult[1]);
                bonus = isNaN(bonus) ? 0 : positiveModifier ? bonus : bonus * -1;
            }
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

        if (person[type]) {
            bonus += person[type];
        }

        if (person.equipment) {
            for (var n in person.equipment) {
                var item = person.equipment[n];
                if (item?.[type] && !isNaN(item[type])) {
                    bonus += parseInt(item[type]);
                }
            };
        }
        else {
            if (person.items) {
                person.items.forEach(item => {
                    if (item?.[type] && !isNaN(item[type])) {
                        bonus += parseInt(item[type]);
                    }
                });
            }
        }

        return bonus;
    }
    
    private find<T>(selector: string, type: string, definitions: IDefinitions): T {
        var collection = definitions[type];

        if (!collection && !selector) {
            return null;
        }

        var match = (<[() => T]>collection).filter((definition: () => T) => {
            return compareString(definition.name, selector);
        });

        return match[0] ? match[0]() : null;
    }
}