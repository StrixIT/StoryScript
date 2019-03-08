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

            if (combo.selectedCombinationAction.requiresTool && !combo.selectedTool) {

                combo.combineText = combo.selectedCombinationAction.text + ' ' + target.name + ' ' + combo.selectedCombinationAction.preposition;
                combo.selectedTool = target;
                return true;
            }

            return self.performCombination(target);
        }

        private performCombination(target: ICombinable): string {
            var self = this;
            var combo = self._game.combinations.activeCombination;
            var tool = combo.selectedTool;
            var type = combo.selectedCombinationAction;
            var text = combo.selectedCombinationAction.requiresTool ? combo.selectedCombinationAction.text + ' ' + tool.name + ' ' + combo.selectedCombinationAction.preposition  + ' ' + target.name:
                                                                        combo.selectedCombinationAction.text + ' ' + combo.selectedCombinationAction.preposition + ' ' + target.name;
            self._game.combinations.activeCombination = null;
            var combination = target.combinations && target.combinations.combine ? target.combinations.combine.filter(c => c.type === type.text && (!type.requiresTool || tool.id === <any>c.target))[0] : null;
            var resultText = null;

            if (combination) {
                resultText = combination.match(self._game, target, tool);
            }
            else if (target.combinations && target.combinations.failText) {
                resultText = typeof target.combinations.failText === 'function' ? target.combinations.failText(self._game, tool, target) : target.combinations.failText;
            }
            else if (type.failText) {
                resultText = typeof type.failText === 'function' ? type.failText(self._game, tool, target) : type.failText;
            }
            else {
                resultText = tool ? self._texts.format(self._texts.noCombination, [tool.name, target.name, type.text, type.preposition]) : self._texts.format(self._texts.noCombinationNoTool, [target.name, type.text, type.preposition]);
            }

            return text = text + (resultText ? ': ' + resultText : '');
        }
    }

    CombinationService.$inject = ['game', 'rules', 'customTexts'];
}