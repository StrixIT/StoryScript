namespace DangerousCave {
    export class LevelUpController {
        constructor(private _scope: ng.IScope, private _rules: Rules, private _game: IGame) {
            var self = this;
            self.game = _game;
            self.init();
        }

        game: IGame;

        selectedReward: {
            name: string,
            value: string
        }

        // Todo: type
        rewards: any;

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
            self._rules.levelUp(self.game, self.selectedReward.name);
        }
    }

    LevelUpController.$inject = ['$scope', 'rules', 'game'];

    var storyScriptModule = angular.module("storyscript");

    storyScriptModule.component('levelUp', {
        templateUrl: 'ui/LevelUpComponent.html',
        controller: LevelUpController
    });
}