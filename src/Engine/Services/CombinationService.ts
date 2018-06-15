namespace StoryScript {
    export interface ICombinationService {
        getCombinationActions(): ICombinationAction[];
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

        tryCombination = (target: ICombinable): boolean | string => {
            var self = this;
            var combo = self._game.activeCombination;

            if (!target || !combo || !combo.selectedCombinationAction) {
                return false;
            }

            if (combo.selectedCombinationAction.requiresTarget && !combo.selectedTool) {

                combo.combineText = combo.selectedCombinationAction.text + ' ' + target.name + ' ' + combo.selectedCombinationAction.preposition;
                combo.selectedTool = target;
                return true;
            }

            var tool = self._game.activeCombination.selectedTool;
            var type = self._game.activeCombination.selectedCombinationAction;
            var text = combo.selectedCombinationAction.requiresTarget ? combo.selectedCombinationAction.text + ' ' + tool.name + ' ' + combo.selectedCombinationAction.preposition  + ' ' + target.name:
                                                                        combo.selectedCombinationAction.text + ' ' + combo.selectedCombinationAction.preposition + ' ' + target.name;
            self._game.activeCombination = null;
            var combination = target.combinations ? target.combinations.combine.filter(c => c.type === type.text && (!type.requiresTarget || tool.id === <any>c.target))[0] : null;

            if (combination) {
                combination.match(self._game, target, tool);
            }
            else if (target.combinations && target.combinations.combineFailText) {
                let failText = typeof target.combinations.combineFailText === 'function' ? target.combinations.combineFailText(self._game, tool, target) : target.combinations.combineFailText;
                self._game.logToActionLog(failText);
            }
            else if (type.combineFailText) {
                let failText = typeof type.combineFailText === 'function' ? type.combineFailText(self._game, tool, target) : type.combineFailText;
                self._game.logToActionLog(failText);
            }
            else {
                var message = tool ? self._texts.format(self._texts.noCombination, [tool.name, target.name, type.text, type.preposition]) : self._texts.format(self._texts.noCombinationNoTarget, [target.name, type.text, type.preposition]);
                self._game.logToActionLog(message);
            }

            return text;
        }
    }

    CombinationService.$inject = ['game', 'rules', 'customTexts'];
}