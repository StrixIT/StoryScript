namespace StoryScript {
    export interface ICombinationService {
        getCombinationActions(): ICombinationAction[];
        getCombineClass(tool: ICombinable): string;
        tryCombination(target: ICombinable): boolean | string;
    }
}

namespace StoryScript {
    export class CombinationService implements ICombinationService {
        constructor(private _game: IGame, private _rules: IRules, private _texts: IInterfaceTexts) {
        }

        getCombinationActions = (): ICombinationAction[] => {
            var self = this;
            return self._rules.getCombinationActions ? self._rules.getCombinationActions() : [];
        }

        getCombineClass = (tool: ICombinable): string => {
            var self = this;
            let className = '';

            if (tool) {
                className = self._game.combinations.activeCombination ? self._game.combinations.activeCombination.selectedTool && self._game.combinations.activeCombination.selectedTool.id === tool.id ? 'combine-active-selected' : 'combine-selectable' : null;
            }
            else {
                className = self._game.combinations.activeCombination  ? 'combine-active-hide' : '';
            }

            return className;
        }

        tryCombination = (target: ICombinable): boolean | string => {
            var self = this;
            var combo = self._game.combinations.activeCombination;

            if (!target || !combo || !combo.selectedCombinationAction) {
                return false;
            }

            combo.selectedCombinationAction.preposition = combo.selectedCombinationAction.preposition || '';

            if (combo.selectedCombinationAction.requiresTarget && !combo.selectedTool) {

                combo.combineText = combo.selectedCombinationAction.text + ' ' + target.name + ' ' + combo.selectedCombinationAction.preposition;
                combo.selectedTool = target;
                return true;
            }

            return self.getReturnText(target);
        }

        private getReturnText(target: ICombinable): string {
            var self = this;
            var combo = self._game.combinations.activeCombination;
            var tool = combo.selectedTool;
            var type = combo.selectedCombinationAction;
            var text = combo.selectedCombinationAction.requiresTarget ? combo.selectedCombinationAction.text + ' ' + tool.name + ' ' + combo.selectedCombinationAction.preposition  + ' ' + target.name:
                                                                        combo.selectedCombinationAction.text + ' ' + combo.selectedCombinationAction.preposition + ' ' + target.name;
            self._game.combinations.activeCombination = null;
            var combination = target.combinations && target.combinations.combine ? target.combinations.combine.filter(c => c.type === type.text && (!type.requiresTarget || tool.id === <any>c.target))[0] : null;
            var resultText = null;

            if (combination) {
                resultText = combination.match(self._game, target, tool);
            }
            else if (target.combinations && target.combinations.combineFailText) {
                resultText = typeof target.combinations.combineFailText === 'function' ? target.combinations.combineFailText(self._game, tool, target) : target.combinations.combineFailText;
            }
            else if (type.combineFailText) {
                resultText = typeof type.combineFailText === 'function' ? type.combineFailText(self._game, tool, target) : type.combineFailText;
            }
            else {
                resultText = tool ? self._texts.format(self._texts.noCombination, [tool.name, target.name, type.text, type.preposition]) : self._texts.format(self._texts.noCombinationNoTarget, [target.name, type.text, type.preposition]);
            }

            return text = text + (resultText ? ': ' + resultText : '');
        }
    }

    CombinationService.$inject = ['game', 'rules', 'customTexts'];
}