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
        }

        private init() {
            var self = this;
            self.$scope.combineSources = self.game.character.items.length > 0 ? self.game.character.items : [];
            self.$scope.combineTargets = self.game.currentLocation.activeItems.concat(<any[]>self.game.currentLocation.activeEnemies).concat(<any[]>self.game.currentLocation.activePersons);
            self.$scope.combineActions = self.ruleService.getCombinationActions();

            self.$scope.combination = {
                type: self.$scope.combineActions[0],
                source: self.$scope.combineSources[0],
                target: self.$scope.combineTargets[0]
            };
        }

        combine = () => {
            return;
        }
    }

    CombinationController.$inject = ['$scope', 'ruleService', 'game', 'customTexts'];
}