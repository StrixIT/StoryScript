import {IHelpers} from '../Interfaces/helpers';
import {IEnemy} from '../Interfaces/enemy';
import {IItem} from '../Interfaces/item';
import {ICollection} from '../Interfaces/collection';
import {IDefinitions} from '../Interfaces/definitions';
import {IGame} from '../Interfaces/game';
import {random} from '../utilities';
import {compareString} from '../globals';
import {ISaveGame} from "storyScript/Interfaces/saveGame.ts";
import {DataKeys} from "storyScript/DataKeys.ts";
import {PlayState} from "storyScript/Interfaces/enumerations/playState.ts";
import {IRules} from "storyScript/Interfaces/rules/rules.ts";
import {IDataService} from "storyScript/Interfaces/services/dataService.ts";

export class HelperService implements IHelpers {
    constructor(private _dataService: IDataService, private _game: IGame, private _rules: IRules, private _definitions: IDefinitions) {
    }

    saveGame = (name?: string): void => {
        name ??= 'ss_default';
        this._rules.general?.beforeSave?.(this._game);

        const saveGame = <ISaveGame>{
            name: name,
            party: this._game.party,
            world: this._game.locations,
            worldProperties: this._game.worldProperties,
            statistics: this._game.statistics,
            state: this._game.state
        };

        this._dataService.save(DataKeys.GAME + '_' + name, saveGame);

        if ( this._game.playState === PlayState.Menu) {
            this._game.playState = null;
        }

        this._rules.general.afterSave?.(this._game);
    }
    
    randomEnemy = (selector?: (enemy: IEnemy) => boolean): IEnemy => random<IEnemy>('enemies', this._definitions, <(enemy: IEnemy) => boolean>selector);

    randomItem = (selector?: (item: IItem) => boolean): IItem => random<IItem>('items', this._definitions, <(item: IItem) => boolean>selector);

    getItem = (selector: string): IItem => this.find<IItem>(selector, 'items', this._definitions);

    getEnemy = (selector: string): IEnemy => this.find<IEnemy>(selector, 'enemies', this._definitions);

    rollDice = (compositeOrSides: string | number, dieNumber: number = 1, bonus: number = 0): number => {
        let sides = 0;

        if (typeof compositeOrSides !== 'number') {
            const dieResult = compositeOrSides.split(/d/i).map(e => e.trim());
            const bonusResult = dieResult[1]?.split(/[+-]/i).map(e => e.trim());

            if (dieResult.length === 1) {
                // Fixed damage, e.g. 6.
                sides = parseInt(dieResult[0]);
            } else {
                // Random damage, 'XdY+/-Z'
                dieNumber = parseInt(dieResult[0]);
                sides = parseInt(bonusResult[0]);
                bonus = typeof bonusResult[1] === 'undefined' ? 0 : parseInt(bonusResult[1]);
                const modifier = compositeOrSides.match(/[+-]/i);
                bonus = bonus > 0 ? modifier?.[0] === '+' ? bonus : bonus * -1 : 0;
            }
        }

        let result = 0;

        for (let i = 0; i < dieNumber; i++) {
            result += Math.floor(Math.random() * sides + 1);
        }

        result += bonus;
        return result;
    }

    calculateBonus = (person: { items?: ICollection<IItem>, equipment?: {} }, type: string) => {
        let bonus = 0;

        if (person[type]) {
            bonus += person[type];
        }

        if (person.equipment) {
            for (const n in person.equipment) {
                const item = person.equipment[n];
                if (item?.[type] && !isNaN(item[type])) {
                    bonus += parseInt(item[type]);
                }
            }
        } else if (person.items) {
            person.items.forEach(item => {
                if (item?.[type] && !isNaN(item[type])) {
                    bonus += parseInt(item[type]);
                }
            });
        }

        return bonus;
    }

    private find<T>(selector: string, type: string, definitions: IDefinitions): T {
        const collection = definitions[type];

        if (!collection && !selector) {
            return null;
        }

        const match = (<[() => T]>collection).filter((definition: () => T) => {
            return compareString(definition.name, selector);
        });

        return match[0] ? match[0]() : null;
    }
}