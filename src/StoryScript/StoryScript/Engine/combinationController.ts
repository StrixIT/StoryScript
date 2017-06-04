module StoryScript {
    export interface ICombinationControllerScope extends ng.IScope {
        game: IGame;
        texts: IInterfaceTexts;
        combination: ICombination;
        combineSources: any[];
        combineTargets: any[];
        combineActions: string[];
    }

    export class CombinationController {
        private $scope: ICombinationControllerScope;
        private ruleService: IRuleService;
        private game: IGame;
        private texts: IInterfaceTexts;

        constructor($scope: ICombinationControllerScope, ruleService: IRuleService, game: IGame, texts: IInterfaceTexts) {
            var self = this;
            self.$scope = $scope;
            self.ruleService = ruleService;
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
            var equipment = [];

            for (var n in self.game.character.equipment) {
                if (self.game.character.equipment[n]) {
                    equipment.push(self.game.character.equipment[n]);
                }
            }

            self.$scope.combineSources = equipment.concat(self.game.character.items);
            self.$scope.combineTargets = <any[]>self.game.currentLocation.activeEnemies.concat(<any[]>self.game.currentLocation.activePersons).concat(<any[]>self.game.currentLocation.destinations.map(d => d.barrier));
            self.$scope.combineActions = self.ruleService.getCombinationActions();

            self.$scope.combination = {
                type: self.$scope.combineActions[0],
                source: self.$scope.combineSources[0],
                target: self.$scope.combineTargets[0]
            };
        }

        tryCombination = (source: { id: string }, target: { id: string, name: string, combinations: [ICombine] }, type: string) => {
            var self = this;

            var combination = target.combinations && target.combinations.filter(c => target.id === target.id && c.type === type)[0];

            if (combination) {
                combination.combine(self.game);
            }
            else {
                self.game.logToActionLog(self.texts.format(self.texts.noCombination, [source.id, target.name, type]))
            };
        }
    }

    CombinationController.$inject = ['$scope', 'ruleService', 'game', 'customTexts'];
}