module DangerousCave {
    export class LevelUpController {
        private $scope: ng.IScope;
        private rules: Rules;
        private game: IGame;

        public selectedReward: {
            name: string,
            value: string
        }

        // Todo: type
        public rewards: any;

        constructor($scope: ng.IScope, rules: Rules, game: IGame) {
            var self = this;
            self.$scope = $scope;
            self.rules = rules;
            self.game = game;
            self.init();
        }

        private init() {
            var self = this;
            self.rewards = [
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

            // Todo: type
            self.selectedReward = <any>{};
        }

        claimReward = () => {
            var self = this;
            self.rules.levelUp(self.game, self.selectedReward.name);
        }
    }

    LevelUpController.$inject = ['$scope', 'rules', 'game'];

    var storyScriptModule = angular.module("storyscript");
    storyScriptModule.controller("LevelUpController", LevelUpController);
}