namespace StoryScript {
    export interface ICombination {
        source: { name };
        target: { name };
        type: ICombinationAction;
    }

    export interface ICombinationControllerScope extends ng.IScope {
        game: IGame;
        texts: IInterfaceTexts;
        combination: ICombination;
        combineSources: any[];
        combineTargets: any[];
        combineActions: ICombinationAction[];
    }

    export class CombinationController {
        private $scope: ICombinationControllerScope;
        private $timeout: ng.ITimeoutService;
        private rules: IRules;
        private game: IGame;
        private texts: IInterfaceTexts;

        constructor($scope: ICombinationControllerScope, $timeout: ng.ITimeoutService, rules: IRules, game: IGame, texts: IInterfaceTexts) {
            var self = this;
            self.$scope = $scope;
            self.$timeout = $timeout;
            self.rules = rules;
            self.game = game;
            self.texts = texts;
            self.$scope.game = self.game;
            self.$scope.texts = self.texts;
            self.init();
            self.$scope.$on('refreshCombine', (event, args) => self.refreshCombine(self));
        }

        private init() {
            var self = this;
            self.refreshCombine(self);
        }

        private refreshCombine(self: CombinationController) {
            if (!self.game.character) {
                return;
            }

            var equipment = [];

            for (var n in self.game.character.equipment) {
                if (self.game.character.equipment[n]) {
                    equipment.push(self.game.character.equipment[n]);
                }
            }

            self.$scope.combineTargets = equipment.concat(self.game.character.items);

            self.$scope.combineSources = <any[]>self.game.currentLocation.activeEnemies
                .concat(<any[]>self.game.currentLocation.activePersons)
                .concat(<any[]>self.game.currentLocation.destinations.map(d => d.barrier).filter(d => d !== undefined))
                .concat(<any[]>self.game.currentLocation.features);

            self.$scope.combineActions = self.rules.getCombinationActions ? self.rules.getCombinationActions()
                .filter(a => self.$scope.combineTargets.length > 0 || a.requiresTarget === false)
                .map(a => { a.requiresTarget = a.requiresTarget === false ? false : true; return a; }) : [];

            self.$timeout(() => {
                self.$scope.combination = {
                    type: self.$scope.combineActions[0],
                    source: self.$scope.combineSources[0],
                    target: self.$scope.combineTargets[0]
                };
            }, 0);
        }

        showCombinations = () => {
            var self = this;
            return self.$scope.combination && self.$scope.combination.source &&
                ((self.$scope.combination.type && !self.$scope.combination.type.requiresTarget)
                    || (self.$scope.combination.target && self.$scope.combination.type));
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
                    combination.match(self.game, source, target);
                }
                else {
                    if (source.combinations.combineFailText) {
                        self.game.logToActionLog(source.combinations.combineFailText(self.game, target));
                    }
                    else {
                        var message = target ? self.texts.format(self.texts.noCombination, [target.id, source.name, type.text, type.preposition]) : self.texts.format(self.texts.noCombinationNoTarget, [source.name, type.text, type.preposition]);
                        self.game.logToActionLog(message);
                    }
                };
            }
        }
    }

    CombinationController.$inject = ['$scope', '$timeout', 'rules', 'game', 'customTexts'];
}