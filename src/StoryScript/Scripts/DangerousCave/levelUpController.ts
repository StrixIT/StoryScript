module DangerousCave {
    export class LevelUpController {
        private $scope: ng.IScope;
        private ruleService: RuleService;
        private game: Game;

        public selectedReward: {
            name: string,
            value: string
        }

        public rewards: [
            {
                name: 'kracht',
                value: 'Kracht'
            },
            {
                name: 'vlugheid',
                value: 'Vlugheid'
            },
            {
                name: 'oplettendheid',
                value: 'Oplettendheid'
            },
            {
                name: 'gezondheid',
                value: 'Gezondheid'
            }
        ];

        constructor($scope: ng.IScope, ruleService: RuleService, game: Game) {
            var self = this;
            self.$scope = $scope;
            self.ruleService = ruleService;
            self.game = game;
            self.init();
        }

        private init() {
            var self = this;

        }

        levelUp = () => {
            var self = this;
            self.ruleService.levelUp(self.selectedReward.name);
        }
    }

    LevelUpController.$inject = ['$scope', 'ruleService', 'game'];

    var storyScriptModule = angular.module("storyscript");
    storyScriptModule.controller("LevelUpController", LevelUpController);
}