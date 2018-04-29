namespace StoryScript {
    export interface ICombination {
        source: { name };
        target: { name };
        type: ICombinationAction;
    }

    export class CombinationController implements ng.IComponentController {
        constructor(private _scope: ng.IScope, private _timeOut: ng.ITimeoutService, private _game: IGame, private _rules: IRules, private _texts: IInterfaceTexts) {
            var self = this;
            self.texts = _texts;

            self.combination = {
                type: null,
                source: null,
                target: null
            };

            self.buildCombine();

            self._scope.$on('buildCombine', self.buildCombine);
        }

        texts: IInterfaceTexts;

        combination: ICombination;
        combineSources: any[];
        combineTargets: any[];
        combineActions: ICombinationAction[];

        showCombinations = () => {
            var self = this;
            return self.combination && self.combination.source &&
                ((self.combination.type && !self.combination.type.requiresTarget)
                    || (self.combination.target && self.combination.type));
        }

        tryCombination = (source: { id: string, name: string, combinations: ICombinations<any> }, target: { id: string }, type: ICombinationAction) => {
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

        private buildCombine = (): void => {
            var self = this;

            if (!self._game.character) {
                return;
            }

            var equipment = [];

            for (var n in self._game.character.equipment) {
                if (self._game.character.equipment[n]) {
                    equipment.push(self._game.character.equipment[n]);
                }
            }

            self.combineTargets = equipment.concat(self._game.character.items);

            self.combineSources = <any[]>self._game.currentLocation.activeEnemies
                .concat(<any[]>self._game.currentLocation.activePersons)
                .concat(<any[]>self._game.currentLocation.destinations.map(d => d.barrier).filter(d => d !== undefined))
                .concat(<any[]>self._game.currentLocation.features);

            self.combineActions = self._rules.getCombinationActions ? self._rules.getCombinationActions()
                .filter(a => self.combineTargets.length > 0 || a.requiresTarget === false)
                .map(a => { a.requiresTarget = a.requiresTarget === false ? false : true; return a; }) : [];

            self._timeOut(() => {
                self.combination = {
                    type: self.combineActions[0],
                    source: self.combineSources[0],
                    target: self.combineTargets[0]
                };
            }, 0);
        }
    }

    CombinationController.$inject = ['$scope', '$timeout', 'game', 'rules', 'customTexts'];
}