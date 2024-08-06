import {IFeature} from '../Interfaces/feature';
import {IItem} from '../Interfaces/item';
import {IEnemy} from '../Interfaces/enemy';
import {IPerson} from '../Interfaces/person';
import {IGame} from '../Interfaces/game';
import {IRules} from '../Interfaces/rules/rules';
import {IInterfaceTexts} from '../Interfaces/interfaceTexts';
import {removeItemFromParty} from './sharedFunctions';
import {ICombinationService} from '../Interfaces/services/combinationService';
import {ICombinationAction} from '../Interfaces/combinations/combinationAction';
import {ICombinable} from '../Interfaces/combinations/combinable';
import {ICombineResult} from '../Interfaces/combinations/combineResult';
import {IActiveCombination} from '../Interfaces/combinations/activeCombination';
import {compareString, getId} from 'storyScript/utilityFunctions';

export class CombinationService implements ICombinationService {
    constructor(private _game: IGame, private _rules: IRules, private _texts: IInterfaceTexts) {
    }

    getCombinationActions = (): ICombinationAction[] => this._rules.setup.getCombinationActions ? this._rules.setup.getCombinationActions() : [];

    getCombineClass = (tool: ICombinable): string => {
        let className: string;

        if (tool) {
            className = this._game.combinations.activeCombination ?
                this._game.combinations.activeCombination.selectedTool && this._game.combinations.activeCombination.selectedTool.id === tool.id ?
                    'combine-active-selected'
                    : 'combine-selectable' : '';
        } else {
            className = this._game.combinations.activeCombination ? 'combine-active-hide' : '';
        }

        return className;
    }

    setActiveCombination = (combination: ICombinationAction): void => {
        this._game.combinations.combinationResult.reset();

        if (!combination) {
            return;
        }

        if (this._game.combinations.activeCombination && this._game.combinations.activeCombination.selectedCombinationAction === combination) {
            this._game.combinations.activeCombination = null;
            return;
        }

        combination.requiresTool = (typeof combination.requiresTool === 'undefined') || combination.requiresTool === true;

        this._game.combinations.activeCombination = {
            selectedCombinationAction: combination,
            selectedTool: null
        };

        this._game.combinations.combinationResult.text = combination.requiresTool ? combination.text : combination.text + ' ' + (combination.preposition || '');
    }

    tryCombination = (target: ICombinable): ICombineResult => {
        let combo = this._game.combinations.activeCombination;
        let result = <ICombineResult>{
            success: false,
            text: ''
        };

        if (!target) {
            return result;
        }

        if (!combo) {
            const defaultAction = this.getCombinationActions().filter(c => c.isDefault)[0];

            if (defaultAction) {
                combo = {
                    selectedCombinationAction: defaultAction,
                    selectedTool: null
                }
            }
        }

        if (!combo?.selectedCombinationAction) {
            return result;
        }

        combo.selectedCombinationAction.preposition = combo.selectedCombinationAction.preposition || '';

        if (combo.selectedCombinationAction.requiresTool && !combo.selectedTool) {
            this._game.combinations.combinationResult.text = combo.selectedCombinationAction.text + ' ' + target.name + ' ' + combo.selectedCombinationAction.preposition;
            combo.selectedTool = target;
            return result;
        }

        result = this.performCombination(target, combo);

        if (result.success) {
            if (result.removeTarget) {
                this.removeFeature(target);
            }

            if (result.removeTool && combo.selectedTool.id != target.id) {
                this.removeFeature(combo.selectedTool);
            }
        }

        this._game.combinations.combinationResult.text = result.text;
        this._game.combinations.combinationResult.done = true;

        return result;
    }

    private performCombination = (target: ICombinable, combo: IActiveCombination): ICombineResult => {
        const tool = combo.selectedTool;
        const type = combo.selectedCombinationAction;
        const prepositionText = combo.selectedCombinationAction.preposition ? ' ' + combo.selectedCombinationAction.preposition + ' ' : ' '
        const text = combo.selectedCombinationAction.requiresTool ? combo.selectedCombinationAction.text + ' ' + tool.name + prepositionText + target.name :
            combo.selectedCombinationAction.text + prepositionText + target.name;

        this._game.combinations.activeCombination = null;

        let combination = target.combinations?.combine ? target.combinations.combine.filter(c => {
            const toolMatch = type.requiresTool && c.tool && this.isMatch(c.tool, tool);
            return c.combinationType === type.text && (!type.requiresTool || toolMatch);
        })[0] : null;

        if (!combination) {
            // For items, the order in which the combination is tried shouldn't matter.
            const anyTool = <any>tool;

            if (anyTool && anyTool.type === 'item' && target && anyTool.type === 'item') {
                combination = tool.combinations?.combine ? tool.combinations.combine.filter(c => c.combinationType === type.text && this.isMatch(c.tool, target))[0] : null;
            }
        }

        const result = <ICombineResult>{
            success: false,
            text: ''
        };

        if (combination) {
            const matchResult = combination.match ? combination.match(this._game, target, tool)
                : combo.selectedCombinationAction.defaultMatch ? combo.selectedCombinationAction.defaultMatch(this._game, target, tool)
                    : undefined;

            if (matchResult === undefined) {
                const entity = <any>target;
                throw new Error(`No match function specified for ${entity.type} ${entity.id} for action ${combination.combinationType}. Neither was a default action specified. Add one or both.`)
            }

            result.success = true;
            result.text = typeof matchResult === 'string' ? matchResult : matchResult.text;
            result.removeTarget = typeof matchResult !== 'string' && matchResult.removeTarget;
            result.removeTool = typeof matchResult !== 'string' && matchResult.removeTool;
        } else if (target.combinations?.failText) {
            result.text = typeof target.combinations.failText === 'function' ? target.combinations.failText(this._game, target, tool) : target.combinations.failText;
        } else if (type.failText) {
            result.text = typeof type.failText === 'function' ? type.failText(this._game, target, tool) : type.failText;
        } else {
            result.text = tool ? this._texts.format(this._texts.noCombination, [tool.name, target.name, type.text, type.preposition]) : this._texts.format(this._texts.noCombinationNoTool, [target.name, type.text, type.preposition]);
        }

        result.text = text + (result.text ? ': ' + result.text : '')
        return result;
    }

    private isMatch = (combineTool: ICombinable, tool: ICombinable): boolean => {
        const combineId = getId(combineTool.id ?? <any>combineTool);
        return compareString(tool.id, combineId);
    }

    private removeFeature = (feature: IFeature): void => {
        // Remove the feature from all possible locations. As we use the object
        // reference, objects of the same type should be left alone.
        this._game.currentLocation.features?.delete(feature);
        this._game.currentLocation.destinations?.forEach(d => {
            d.barriers.forEach(([k, b]) => {
                if (b === feature) {
                    d.barriers.delete([k, b]);
                }
            })
        });

        removeItemFromParty(this._game.party, <IItem>feature);
        this._game.currentLocation.items?.delete(<IItem>feature);
        this._game.currentLocation.enemies?.delete(<IEnemy>feature);
        this._game.currentLocation.persons?.delete(<IPerson>feature);
    }
}