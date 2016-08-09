module StoryScript {
    export class MainController {
        private $scope: ng.IScope;
        private $window: ng.IWindowService;
        private locationService: ILocationService;
        private ruleService: IRuleService;
        private gameService: IGameService;
        private game: IGame;
        private textService: ITextService;
        private texts: any = {};

        // Todo: can this be done differently?
        private nonDisplayAttributes: string[] = [ 'name', 'items', 'equipment', 'hitpoints', 'currentHitpoints', 'level', 'score'];
        private characterAttributes: string[];

        // Todo: can this be done differently?
        public reset(): void { };

        constructor($scope: ng.IScope, $window: ng.IWindowService, locationService: ILocationService, ruleService: IRuleService, gameService: IGameService, game: IGame, textService: ITextService) {
            var self = this;
            self.$scope = $scope;
            self.$window = $window;
            self.locationService = locationService;
            self.ruleService = ruleService;
            self.gameService = gameService;
            self.game = game;
            self.textService = textService;
            self.init();
        }

        private init() {
            var self = this;
            self.gameService.init();

            // Todo: type
            (<any>self.$scope).game = self.game;
            (<any>self.$scope).texts = self.texts;

            self.setDisplayTexts();
            self.getCharacterAttributesToShow();

            // Watch functions.
            self.$scope.$watch('game.character.currentHitpoints', self.watchCharacterHitpoints);
            self.$scope.$watch('game.character.score', self.watchCharacterScore);
            self.$scope.$watch('game.state', self.watchGameState);

            self.reset = () => { self.gameService.reset.call(self.gameService); };
        }

        startNewGame = () => {
            var self = this;
            self.gameService.startNewGame(self.game.createCharacterSheet);
            self.getCharacterAttributesToShow();
            self.game.state = 'play';
        }

        restart = () => {
            var self = this;
            self.gameService.restart();
            self.init();
        }

        isSlotUsed(slot: string) {
            var self = this;

            if (self.game.character) {
                return self.game.character.equipment[slot] !== undefined;
            }
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

        enemiesPresent = () => {
            var self = this;
            return self.game.currentLocation && self.game.currentLocation.enemies.length;
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

        public executeAction(action: IAction) {
            var self = this;

            if (action && action.execute) {
                // Modify the arguments collection to add the game to the collection before calling the function specified.
                var args = [].slice.call(arguments);
                args.shift();
                args.splice(0, 0, self.game);

                // Execute the action and when nothing or false is returned, remove it from the current location.
                var result = action.execute.apply(this, args);

                // Todo: combat actions will never be removed this way.
                if (!result && self.game.currentLocation.actions) {
                    self.game.currentLocation.actions.remove(action);
                }

                // After each action, save the game.
                self.gameService.saveGame();
            }
        }

        executeBarrierAction = (destination, barrier: IBarrier) => {
            var self = this;

            // improve, use selected action as object.
            var action = barrier.actions.filter((item: IBarrier) => { return item.text == barrier.selectedAction.text; })[0];
            var result = action.action(self.game, destination, barrier, action);

            if (!result) {
                barrier.actions.remove(action);
            }

            self.gameService.saveGame();
        }

        changeLocation = (location: string) => {
            var self = this;

            // Call changeLocation without using the execute action as the game parameter is not needed.
            self.game.changeLocation(location);
            self.gameService.saveGame();
        }

        pickupItem = (item: IItem): void => {
            var self = this;
            self.game.character.items.push(item);
            self.game.currentLocation.items.remove(item);
        }

        dropItem = (item: IItem): void => {
            var self = this;
            self.game.character.items.remove(item);
            self.game.currentLocation.items.push(item);
        }

        canEquip = (item: IItem): boolean => {
            return item.equipmentType != StoryScript.EquipmentType.Miscellaneous;
        }

        equipItem = (item: IItem) => {
            var self = this;
            var type = StoryScript.EquipmentType[item.equipmentType];
            type = type.substring(0, 1).toLowerCase() + type.substring(1);

            var equippedItem = self.game.character.equipment[type];

            if (equippedItem) {
                self.game.character.items.push(equippedItem);
            }

            self.game.character.equipment[type] = item;
            self.game.character.items.remove(item);
        }

        unequipItem = (item: IItem) => {
            var self = this;
            var type = StoryScript.EquipmentType[item.equipmentType];
            type = type.substring(0, 1).toLowerCase() + type.substring(1);

            var equippedItem = self.game.character.equipment[type];

            if (equippedItem) {
                self.game.character.items.push(equippedItem);
            }

            self.game.character.equipment[type] = null;
        }

        fight = (enemy: IEnemy) => {
            var self = this;
            self.gameService.fight(enemy);
            self.gameService.saveGame();
        }

        private watchCharacterHitpoints(newValue, oldValue, scope) {
            if (parseInt(newValue) && parseInt(oldValue) && newValue != oldValue) {
                var change = newValue - oldValue;
                scope.controller.gameService.hitpointsChange(change);
            }
        }

        private watchCharacterScore(newValue, oldValue, scope) {
            if (parseInt(newValue) && parseInt(oldValue) && newValue != oldValue) {
                var increase = newValue - oldValue;
                scope.controller.gameService.scoreChange(increase);
            }
        }

        private watchGameState(newValue, oldValue, scope) {
            if (newValue != undefined) {
                scope.controller.gameService.changeGameState(newValue);
            }
        }

        private getCharacterAttributesToShow() {
            var self = this;
            self.characterAttributes = [];

            for (var n in self.game.character) {
                if (self.game.character.hasOwnProperty(n) && self.nonDisplayAttributes.indexOf(n) == -1) {
                    self.characterAttributes.push(n);
                }
            }

            self.characterAttributes.sort();
        }

        private setDisplayTexts() {
            var self = this;

            var defaultTexts = new DefaultTexts();
            var customTexts = (<any>self.textService).$get();

            for (var n in defaultTexts) {
                self.texts[n] = customTexts[n] ? customTexts[n] : defaultTexts[n];
            }

            self.texts.format = defaultTexts.format;
        }
    }

    MainController.$inject = ['$scope', '$window', 'locationService', 'ruleService', 'gameService', 'game', 'textService'];
}