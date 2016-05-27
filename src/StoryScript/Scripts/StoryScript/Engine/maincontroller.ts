module StoryScript {
    export class MainController {
        private $scope: ng.IScope;
        private $window: ng.IWindowService;
        private locationService: ILocationService;
        private ruleService: IRuleService;
        private gameService: IGameService;
        private game: IGame;

        public createCharacterForm: any;

        // Todo: can this be done differently?
        public reset(): void { };

        constructor($scope: ng.IScope, $window: ng.IWindowService, locationService: ILocationService, ruleService: IRuleService, gameService: IGameService, game: IGame) {
            var self = this;
            self.$scope = $scope;
            self.$window = $window;
            self.locationService = locationService;
            self.ruleService = ruleService;
            self.gameService = gameService;
            self.game = game;
            self.init();
        }

        private init() {
            var self = this;
            self.gameService.init();
            self.createCharacterForm = self.ruleService.getCharacterForm();
            self.reset = () => { self.gameService.reset.call(self.gameService); };
        }

        startNewGame = () => {
            var self = this;
            self.gameService.startNewGame(self.createCharacterForm);
            self.game.state = 'play';
        }

        restart = () => {
            var self = this;
            self.gameService.restart();
            self.init();
        }

        getButtonClass = (action) => {
            var type = action.type || 'move';
            var buttonClass = 'btn-';

            switch (type) {
                case 'move': {
                    buttonClass += 'info'
                } break;
                case 'skill': {
                    buttonClass += 'warning';
                } break;
                case 'fight': {
                    buttonClass += 'danger';
                } break;
            }

            return buttonClass;
        }

        getActionName = (barrier, action) => {
            // Get the name of the barrier action from the barrier without the need to specify it
            // in the definition.
            for (var n in barrier.actions) {
                var currentAction = barrier.actions[n];

                if (currentAction == action) {
                    return n;
                }
            }
        }

        enemiesPresent = () => {
            var self = this;
            return self.game.currentLocation.enemies.length;
        }

        barriersPresent = () => {
            var self = this;
            return self.game.currentLocation.destinations && self.game.currentLocation.destinations.some(function (destination) { return !isEmpty(destination.barrier); });
        }

        actionsPresent = () => {
            var self = this;
            return !self.enemiesPresent() && !isEmpty(self.game.currentLocation.actions);
        }

        disableActionButton = (action) => {
            var self = this;
            return typeof action.active === "function" ? !action.active(self.game) : action.active == undefined ? false : !action.active;
        }

        public executeAction(action) {
            var self = this;

            if (action && typeof action === 'function') {
                // Modify the arguments collection to add the game to the collection before
                // calling the function specified.
                var args = [].slice.call(arguments);
                args.shift();
                args.splice(0, 0, self.game);
                action.apply(this, args);

                // After each action, save the game.
                self.gameService.saveGame();
            }
        }

        executeBarrierAction = (destination, barrier) => {
            var self = this;

            // Get the selected action manually because ng-options does not work and I have to use ng-repeat
            // which does not supply a full object.
            var action = barrier.actions[barrier.selectedAction];
            var args = [action.action, destination, barrier, action];
            self.executeAction.apply(this, args);
        }

        changeLocation = (location) => {
            var self = this;

            // Call changeLocation without using the execute action as the game parameter is not needed.
            self.game.changeLocation(location);
            self.gameService.saveGame();
        }
    }

    MainController.$inject = ['$scope', '$window', 'locationService', 'ruleService', 'gameService', 'game'];
}