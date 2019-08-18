namespace StoryScript {
    export interface ICombinationService {
        getCombinationActions(): ICombinationAction[];
        getCombineClass(tool: ICombinable): string;
        tryCombination(target: ICombinable): ICombineResult;
    }
}

namespace StoryScript {
    export class CombinationService implements ICombinationService {
        constructor(private _dataService: IDataService, private _locationService: ILocationService, private _game: IGame, private _rules: IRules, private _texts: IInterfaceTexts) {
        }

        getCombinationActions = (): ICombinationAction[] => {
            var self = this;
            return self._rules.setup.getCombinationActions ? self._rules.setup.getCombinationActions() : [];
        }

        getCombineClass = (tool: ICombinable): string => {
            var self = this;
            let className = '';

            // TODO: actually use the 'combine-active-selected' class!
            if (tool) {
                className = self._game.combinations.activeCombination ? self._game.combinations.activeCombination.selectedTool && self._game.combinations.activeCombination.selectedTool.id === tool.id ? 'combine-active-selected' : 'combine-selectable' : '';
            }
            else {
                className = self._game.combinations.activeCombination  ? 'combine-active-hide' : '';
            }

            return className;
        }

        tryCombination = (target: ICombinable): ICombineResult => {
            var self = this;
            var combo = self._game.combinations.activeCombination;
            var result = <ICombineResult>{
                success: false,
                text: ''
            };

            if (!target || !combo || !combo.selectedCombinationAction) {
                return result;
            }

            combo.selectedCombinationAction.preposition = combo.selectedCombinationAction.preposition || '';

            if (combo.selectedCombinationAction.requiresTool && !combo.selectedTool) {

                combo.combineText = combo.selectedCombinationAction.text + ' ' + target.name + ' ' + combo.selectedCombinationAction.preposition;
                combo.selectedTool = target;
                return result;
            }

            result = self.performCombination(target);

            if (result.success) {
                if (result.removeTarget) {
                    self._game.currentLocation.features.remove(target.id);
                }

                if (result.removeTool && combo.selectedTool.id != target.id) {
                    self._game.currentLocation.features.remove(combo.selectedTool.id);
                }

                SaveWorldState(self._dataService, self._locationService, self._game);
            }

            return result;
        }

        private performCombination(target: ICombinable): ICombineResult {
            var self = this;
            var combo = self._game.combinations.activeCombination;
            var tool = combo.selectedTool;
            var type = combo.selectedCombinationAction;
            var text = combo.selectedCombinationAction.requiresTool ? combo.selectedCombinationAction.text + ' ' + tool.name + ' ' + combo.selectedCombinationAction.preposition  + ' ' + target.name:
                                                                        combo.selectedCombinationAction.text + ' ' + combo.selectedCombinationAction.preposition + ' ' + target.name;

            self._game.combinations.activeCombination = null;
            
            var combination = target.combinations && target.combinations.combine ? target.combinations.combine.filter(c => {
                var toolMatch = type.requiresTool && c.tool && self.isMatch(c.tool, tool);
                return c.combinationType === type.text && (!type.requiresTool || toolMatch);
            })[0] : null;
            
            if (!combination) {
                // For items, the order in which the combination is tried shouldn't matter.
                // Todo: better type the type property.
                if (tool && (<any>tool).type === 'item' && target && (<any>target).type === 'item') {
                    combination = tool.combinations && tool.combinations.combine ? tool.combinations.combine.filter(c => c.combinationType === type.text && self.isMatch(c.tool, target))[0] : null;
                }
            }
            
            var result = <ICombineResult>{
                success: false,
                text: ''
            };

            if (combination) {
                var matchResult = combination.match(self._game, target, tool);
                result.success = true;
                result.text = typeof matchResult === 'string' ? matchResult : matchResult.text;
                result.removeTarget = typeof matchResult !== 'string' && matchResult.removeTarget;
                result.removeTool = typeof matchResult !== 'string' && matchResult.removeTool;
            }
            else if (target.combinations && target.combinations.failText) {
                result.text = typeof target.combinations.failText === 'function' ? target.combinations.failText(self._game, target, tool) : target.combinations.failText;
            }
            else if (type.failText) {
                result.text = typeof type.failText === 'function' ? type.failText(self._game, target, tool) : type.failText;
            }
            else {
                result.text = tool ? self._texts.format(self._texts.noCombination, [target.name, tool.name, type.text, type.preposition]) : self._texts.format(self._texts.noCombinationNoTool, [target.name, type.text, type.preposition]);
            }

            result.text = text + (result.text ? ': ' + result.text : '')
            return result;
        }

        private isMatch(combineTool: any, tool: ICombinable) {
            var combineId = typeof combineTool === 'function' ? combineTool.name || combineTool.originalFunctionName : combineTool;
            return tool.id.toLowerCase() === combineId.toLowerCase();
        }
    }

    CombinationService.$inject = ['dataService', 'locationService', 'game', 'rules', 'customTexts'];
}