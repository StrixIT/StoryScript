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
        let sides = 0;

        if (typeof compositeOrSides !== 'number') {
            const dieResult = compositeOrSides.split(/d/i).map(e => e.trim());
            const bonusResult = dieResult[1]?.split(/[+-]/i).map(e => e.trim());

            if (dieResult.length === 1) {
                // Fixed damage, e.g. 6.
                sides = parseInt(dieResult[0]);
            }
            else {
                // Random damage, 'XdY+/-Z'
                dieNumber = parseInt(dieResult[0]);
                sides = parseInt(bonusResult[0]);
                bonus = typeof bonusResult[1] === undefined ? 0 : parseInt(bonusResult[1]);
                const modifier = compositeOrSides.match(/[+-]/i);
                bonus = bonus > 0 ? modifier && modifier[0] === '+' ? bonus : bonus * -1 : 0;
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