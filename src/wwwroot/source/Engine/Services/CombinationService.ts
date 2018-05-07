namespace StoryScript {
    export interface ICombinationService {
        buildCombine(): ICombinationSelector;
        tryCombination(source: { id: string, name: string, combinations: ICombinations<any> }, target: { id: string }, type: ICombinationAction): void;
        showCombinations(combination): boolean;
    }
}

namespace StoryScript {
    export class CombinationService implements ng.IServiceProvider, ICombinationService {
        constructor(private _game: IGame, private _rules: IRules, private _texts: IInterfaceTexts) {
            
        }

        public $get(game: IGame, rules: IRules, texts: IInterfaceTexts): ICombinationService {
            var self = this;
            self._game = game;
            self._rules = rules;
            self._texts = texts;

            return {
                buildCombine: self.buildCombine,
                tryCombination: self.tryCombination,
                showCombinations: self.showCombinations
            };
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

            combinationSelector.combineSources = <any[]>self._game.currentLocation.activeEnemies
                .concat(<any[]>self._game.currentLocation.activePersons)
                .concat(<any[]>self._game.currentLocation.destinations.map(d => d.barrier).filter(d => d !== undefined))
                .concat(<any[]>self._game.currentLocation.features);

            combinationSelector.combineActions = self._rules.getCombinationActions ? self._rules.getCombinationActions()
                .filter(a => combinationSelector.combineTargets.length > 0 || a.requiresTarget === false)
                .map(a => { a.requiresTarget = a.requiresTarget === false ? false : true; return a; }) : [];

            combinationSelector.combination = {
                type: combinationSelector.combineActions[0],
                source: combinationSelector.combineSources[0],
                target: combinationSelector.combineTargets[0]
            };

            return combinationSelector;
        }

        tryCombination = (source: { id: string, name: string, combinations: ICombinations<any> }, target: { id: string }, type: ICombinationAction): void => {
            var self = this;

            if (!source) {
                return;
            }

            var combines = source.combinations && source.combinations.combine;

            if (combines) {
                var combination = combines.filter(c => c.type === type.text && (!type.requiresTarget || target.id === c.target))[0];

                if (combination) {
                    combination.match(self._game, source, target);
                }
                else {
                    if (source.combinations.combineFailText) {
                        self._game.logToActionLog(source.combinations.combineFailText(self._game, target));
                    }
                    else {
                        var message = target ? self._texts.format(self._texts.noCombination, [target.id, source.name, type.text, type.preposition]) : self._texts.format(self._texts.noCombinationNoTarget, [source.name, type.text, type.preposition]);
                        self._game.logToActionLog(message);
                    }
                };
            }
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