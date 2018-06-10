namespace StoryScript {
    export interface ICombinationService {
        getCombinationActions(): ICombinationAction[];
        buildCombine(): ICombinationSelector;
        tryCombination(target: ICombinable<any>): boolean | string;
        showCombinations(combination): boolean;
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

        buildCombine = (): ICombinationSelector => {
            var self = this;

            if (!self._game.character) {
                return null;
            }

            var equipment = [];

            for (var n in self._game.character.equipment) {
                if (self._game.character.equipment[n]) {
                    equipment.push(self._game.character.equipment[n]);
                }
            }

            var combinationSelector = <ICombinationSelector>{};

            combinationSelector.combineTargets = equipment.concat(self._game.character.items);

            combinationSelector.combineTools = <any[]>self._game.currentLocation.activeEnemies
                .concat(<any[]>self._game.currentLocation.activePersons)
                .concat(<any[]>self._game.currentLocation.destinations.map(d => d.barrier).filter(d => d !== undefined))
                .concat(<any[]>self._game.currentLocation.features);

            combinationSelector.combineActions = self._rules.getCombinationActions ? self._rules.getCombinationActions()
                .filter(a => combinationSelector.combineTargets.length > 0 || a.requiresTarget === false)
                .map(a => { a.requiresTarget = a.requiresTarget === false ? false : true; return a; }) : [];

            combinationSelector.combination = {
                type: combinationSelector.combineActions[0],
                tool: combinationSelector.combineTools[0],
                target: combinationSelector.combineTargets[0]
            };

            return combinationSelector;
        }

        tryCombination = (target: ICombinable<any>): boolean | string => {
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
            var combination = target.combinations ? target.combinations.combine.filter(c => c.type === type.text && (!type.requiresTarget || tool.id === c.target))[0] : null;

            if (combination) {
                combination.match(self._game, target, tool);
            }
            else if (target.combinations.combineFailText) {
                self._game.logToActionLog(target.combinations.combineFailText(self._game, tool));
            }
            else {
                var message = tool ? self._texts.format(self._texts.noCombination, [tool.name, target.name, type.text, type.preposition]) : self._texts.format(self._texts.noCombinationNoTarget, [target.name, type.text, type.preposition]);
                self._game.logToActionLog(message);
            }

            return text;
        }

        showCombinations = (combination): boolean => {
            var self = this;
            return combination && combination.source &&
                ((combination.type && !combination.type.requiresTarget)
                    || (combination.target && combination.type));
        }
    }

    CombinationService.$inject = ['game', 'rules', 'customTexts'];
}