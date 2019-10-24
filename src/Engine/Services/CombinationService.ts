namespace StoryScript {
    export interface ICombinationService {
        getCombinationActions(): ICombinationAction[];
        getCombineClass(tool: ICombinable): string;
        setActiveCombination(combination: ICombinationAction): void;
        tryCombination(target: ICombinable): ICombineResult;
    }
}

namespace StoryScript {
    export class CombinationService implements ICombinationService {
        constructor(private _dataService: IDataService, private _locationService: ILocationService, private _game: IGame, private _rules: IRules, private _texts: IInterfaceTexts) {
        }

        getCombinationActions = (): ICombinationAction[] => this._rules.setup.getCombinationActions ? this._rules.setup.getCombinationActions() : [];

        getCombineClass = (tool: ICombinable): string => {
            let className = '';

            if (tool) {
                className = this._game.combinations.activeCombination ? this._game.combinations.activeCombination.selectedTool && this._game.combinations.activeCombination.selectedTool.id === tool.id ? 'combine-active-selected' : 'combine-selectable' : '';
            }
            else {
                className = this._game.combinations.activeCombination  ? 'combine-active-hide' : '';
            }

            return className;
        }

        setActiveCombination = (combination: ICombinationAction): void => {
            this._game.combinations.combinationResultText = null;

            if (!combination) {
                return;
            }

            if (this._game.combinations.activeCombination && this._game.combinations.activeCombination.selectedCombinationAction === combination) {
                this._game.combinations.activeCombination = null;
                return;
            }

            combination.requiresTool = combination.requiresTool === undefined || combination.requiresTool === true ? true : false;

            this._game.combinations.activeCombination = {
                selectedCombinationAction: combination,
                selectedTool: null
            };

            this._game.combinations.combinationResultText = combination.requiresTool ? combination.text : combination.text + ' ' + (combination.preposition || '');
        }

        tryCombination = (target: ICombinable): ICombineResult => {
            var combo = this._game.combinations.activeCombination;
            var result = <ICombineResult>{
                success: false,
                text: ''
            };

            if (!target) {
                return result;
            }

            if (!combo) {
                var defaultAction = this.getCombinationActions().filter(c => c.isDefault)[0];

                if (defaultAction) {
                    combo = {
                        selectedCombinationAction: defaultAction,
                        selectedTool: null
                    }
                }
            }

            if (!combo || !combo.selectedCombinationAction) {
                return result;
            }

            combo.selectedCombinationAction.preposition = combo.selectedCombinationAction.preposition || '';

            if (combo.selectedCombinationAction.requiresTool && !combo.selectedTool) {

                this._game.combinations.combinationResultText = combo.selectedCombinationAction.text + ' ' + target.name + ' ' + combo.selectedCombinationAction.preposition;
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

                SaveWorldState(this._dataService, this._locationService, this._game);
            }

            this._game.combinations.combinationResultText = result.text;

            return result;
        }

        private performCombination = (target: ICombinable, combo: IActiveCombination): ICombineResult => {
            var tool = combo.selectedTool;
            var type = combo.selectedCombinationAction;
            var prepositionText = combo.selectedCombinationAction.preposition ? ' ' + combo.selectedCombinationAction.preposition + ' ' : ' '
            var text = combo.selectedCombinationAction.requiresTool ? combo.selectedCombinationAction.text + ' ' + tool.name + prepositionText + target.name:
                                                                        combo.selectedCombinationAction.text + prepositionText + target.name;

            this._game.combinations.activeCombination = null;
            
            var combination = target.combinations && target.combinations.combine ? target.combinations.combine.filter(c => {
                var toolMatch = type.requiresTool && c.tool && this.isMatch(c.tool, tool);
                return c.combinationType === type.text && (!type.requiresTool || toolMatch);
            })[0] : null;
            
            if (!combination) {
                // For items, the order in which the combination is tried shouldn't matter.
                var anyTool = <any>tool;

                if (anyTool && anyTool.type === 'item' && target && anyTool.type === 'item') {
                    combination = tool.combinations && tool.combinations.combine ? tool.combinations.combine.filter(c => c.combinationType === type.text && this.isMatch(c.tool, target))[0] : null;
                }
            }
            
            var result = <ICombineResult>{
                success: false,
                text: ''
            };

            if (combination) {
                var matchResult = combination.match ? combination.match(this._game, target, tool) 
                                    : combo.selectedCombinationAction.defaultMatch ? combo.selectedCombinationAction.defaultMatch(this._game, target, tool)
                                        : undefined;

                if (matchResult === undefined) {
                    var entity = <any>target;
                    throw new Error(`No match function specified for ${entity.type} ${entity.id} for action ${combination.combinationType}. Neither was a default action specified. Add one or both.`)
                }
                
                result.success = true;
                result.text = typeof matchResult === 'string' ? matchResult : matchResult.text;
                result.removeTarget = typeof matchResult !== 'string' && matchResult.removeTarget;
                result.removeTool = typeof matchResult !== 'string' && matchResult.removeTool;
            }
            else if (target.combinations && target.combinations.failText) {
                result.text = typeof target.combinations.failText === 'function' ? target.combinations.failText(this._game, target, tool) : target.combinations.failText;
            }
            else if (type.failText) {
                result.text = typeof type.failText === 'function' ? type.failText(this._game, target, tool) : type.failText;
            }
            else {
                result.text = tool ? this._texts.format(this._texts.noCombination, [tool.name, target.name, type.text, type.preposition]) : this._texts.format(this._texts.noCombinationNoTool, [target.name, type.text, type.preposition]);
            }

            result.text = text + (result.text ? ': ' + result.text : '')
            return result;
        }

        private isMatch = (combineTool: any, tool: ICombinable): boolean => {
            var combineId = typeof combineTool === 'function' ? combineTool.name || combineTool.originalFunctionName : combineTool;
            return compareString(tool.id, combineId);
        }

        private removeFeature = (feature: IFeature): void => {
            // Remove the feature from all possible locations. As we use the object
            // reference, objects of the same type should be left alone.
            this._game.currentLocation.features.remove(feature);
            this._game.currentLocation.destinations.forEach(d => {
                if (d.barrier === feature) {
                    d.barrier = null;
                }
            });

            this._game.currentLocation.items.remove(<IItem>feature);
            this._game.character.items.remove(<IItem>feature);
            // When equipment can be used in combinations, remove items from the
            // character's equipment as well.

            this._game.currentLocation.enemies.remove(<IEnemy>feature);
            this._game.currentLocation.persons.remove(<IPerson>feature);
        }
    }

    CombinationService.$inject = ['dataService', 'locationService', 'game', 'rules', 'customTexts'];
}