module StoryScript {
    export interface IModalSettings {
        title: string;
        closeText: string;
        canClose: boolean;
        closeAction: (game: IGame) => void;
    }

    export interface IMainControllerScope extends ng.IScope {
        modalSettings: IModalSettings;
        game: IGame;
        texts: any;
    }

    export class MainController {
        private $scope: IMainControllerScope;
        private $window: ng.IWindowService;
        private $sce: ng.ISCEService;
        private locationService: ILocationService;
        private ruleService: IRuleService;
        private gameService: IGameService;
        private game: IGame;
        private customTexts: IInterfaceTexts;
        private texts: any = {};
        private encounters: ICollection<IEnemy>;
        private modalSettings: IModalSettings;

        // Todo: can this be done differently?
        private nonDisplayAttributes: string[] = ['name', 'items', 'equipment', 'hitpoints', 'currentHitpoints', 'level', 'score', 'currency'];
        private characterAttributes: string[];

        // Todo: can this be done differently?
        public reset(): void { };

        constructor($scope: IMainControllerScope, $window: ng.IWindowService, $sce: ng.ISCEService, locationService: ILocationService, ruleService: IRuleService, gameService: IGameService, game: IGame, customTexts: IInterfaceTexts) {
            var self = this;
            self.$scope = $scope;
            self.$window = $window;
            self.$sce = $sce;
            self.locationService = locationService;
            self.ruleService = ruleService;
            self.gameService = gameService;
            self.game = game;
            self.customTexts = customTexts;
            self.init();
        }

        private init() {
            var self = this;
            self.gameService.init();

            self.$scope.game = self.game;
            self.$scope.texts = self.texts;

            self.setDisplayTexts();
            self.getCharacterAttributesToShow();

            // Watch functions.
            self.$scope.$watch('game.character.currentHitpoints', self.watchCharacterHitpoints);
            self.$scope.$watch('game.character.score', self.watchCharacterScore);
            self.$scope.$watch('game.state', self.watchGameState);
            self.$scope.$watchCollection('game.currentLocation.enemies', self.initCombat);

            self.reset = () => { self.gameService.reset.call(self.gameService); };

            self.$scope.modalSettings = <IModalSettings>{
                title: '',
                closeText: self.texts.closeModal
            }
        }

        startNewGame = () => {
            var self = this;
            self.gameService.startNewGame(self.game.createCharacterSheet);
            self.getCharacterAttributesToShow();
            self.game.state = StoryScript.GameState.Play;
        }

        restart = () => {
            var self = this;
            self.gameService.restart();
            self.init();
        }

        getDescription() {
            var self = this;

            if (self.game.currentLocation && self.game.currentLocation.text) {
                return self.$sce.trustAsHtml(self.game.currentLocation.text);
            }
        }

        isSlotUsed(slot: string) {
            var self = this;

            if (self.game.character) {
                return self.game.character.equipment[slot] !== undefined;
            }
        }

        getButtonClass = (action: IAction) => {
            var type = action.type || ActionType.Regular;
            var buttonClass = 'btn-';

            switch (type) {
                case ActionType.Regular: {
                    buttonClass += 'info'
                } break;
                case ActionType.Check: {
                    buttonClass += 'warning';
                } break;
                case ActionType.Combat: {
                    buttonClass += 'danger';
                } break;
            }

            return buttonClass;
        }

        enemiesPresent = () => {
            var self = this;
            return self.game.currentLocation && self.game.currentLocation.enemies.length;
        }

        personsPresent = () => {
            var self = this;
            return self.game.currentLocation && self.game.currentLocation.persons.length;
        }

        barriersPresent = () => {
            var self = this;
            return self.game.currentLocation.destinations && self.game.currentLocation.destinations.some(function (destination) { return !isEmpty(destination.barrier); });
        }

        actionsPresent = () => {
            var self = this;
            return !self.enemiesPresent() && !isEmpty(self.game.currentLocation.actions);
        }

        disableActionButton = (action: IAction) => {
            var self = this;
            return typeof action.status === "function" ? (<any>action).status(self.game) == ActionStatus.Disabled : action.status == undefined ? false : (<any>action).status == ActionStatus.Disabled;
        }

        hideActionButton = (action: IAction) => {
            var self = this;
            return typeof action.status === "function" ? (<any>action).status(self.game) == ActionStatus.Unavailable : action.status == undefined ? false : (<any>action).status == ActionStatus.Unavailable;
        }

        public executeAction(action: IAction) {
            var self = this;

            if (action && action.execute) {
                // Modify the arguments collection to add the game to the collection before calling the function specified.
                var args = [].slice.call(arguments);
                args.shift();
                args.splice(0, 0, self.game);

                if (typeof action.execute !== 'function') {
                    action.execute = self[<string>action.execute];
                    args = args.concat(action.arguments);
                }

                // Execute the action and when nothing or false is returned, remove it from the current location.
                var result = (<(game: IGame, ...params) => void>action.execute).apply(this, args);

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

        useItem = (item: IItem): void => {
            var self = this;
            item.use(self.game, item);
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

        initCombat = (newValue: IEnemy[]) => {
            var self = this;

            if (newValue && newValue.length > 0 && self.game.state !== GameState.Combat) {

                self.$scope.modalSettings.title = self.texts.combatTitle;
                self.$scope.modalSettings.canClose = false;

                self.game.combatLog = [];

                if (self.ruleService.initCombat) {
                    self.ruleService.initCombat(self.game.currentLocation);
                }
            }
            else if (newValue && newValue.length == 0) {
                self.$scope.modalSettings.canClose = true;
            }
        }

        startCombat = () => {
            var self = this;
            self.game.state = GameState.Combat;
        }

        fight = (enemy: IEnemy) => {
            var self = this;
            self.gameService.fight(enemy);
            self.gameService.saveGame();
        }

        canPay = (currency: number, value: number) => {
            return (value != undefined && currency != undefined && currency >= value) || value == 0;
        }

        actualPrice = (item: IItem, modifier: number | (() => number)) => {
            var self = this;
            modifier = modifier == undefined ? 1 : typeof modifier === 'function' ? (<any>modifier)(self.game) : modifier;
            return Math.round(item.value * <number>modifier);
        }

        displayPrice = (item: IItem, actualPrice: number) => {
            var self = this;
            return actualPrice > 0 ? (item.name + ': ' + actualPrice + ' ' + self.texts.currency) : item.name;
        }

        buy = (item: IItem, trade: ITrade) => {
            var self = this;
            var price = item.value;

            if (trade.buy.priceModifier != undefined) {
                var modifier = typeof trade.buy.priceModifier === 'function' ? (<any>trade.buy).priceModifier(self.game) : trade.buy.priceModifier;
                price = Math.round(item.value * modifier);
            }

            self.game.character.currency = self.game.character.currency || 0;
            self.game.character.currency -= price;

            self.game.character.items.push(item);

            if (trade.currency != undefined) {
                trade.currency += price;
            }

            trade.sell.items.remove(item);
        }

        sell = (item: IItem, trade: ITrade) => {
            var self = this;
            var price = item.value;

            if (trade.sell.priceModifier != undefined) {
                var modifier = typeof trade.sell.priceModifier === 'function' ? (<any>trade.sell).priceModifier(self.game) : trade.sell.priceModifier;
                price = Math.round(item.value * modifier);
            }

            self.game.character.currency = self.game.character.currency || 0;
            self.game.character.currency += price;

            self.game.character.items.remove(item);
            trade.buy.items.remove(item);

            if (trade.currency != undefined) {
                trade.currency -= price;
            }

            trade.sell.items.push(item);
        }

        talk = (person: IPerson) => {
            var self = this;
            self.$scope.modalSettings.title = person.conversation.title || self.texts.format(self.texts.talk, [person.name]);
            self.$scope.modalSettings.canClose = true;
            self.game.currentLocation.activePerson = person;
            self.game.state = GameState.Conversation;
        }

        trade = (game: IGame, trade: IPerson | ITrade) => {
            var self = this;

            if (!trade) {
                return;
            }

            self.game.currentLocation.activeTrade = (<IPerson>trade).trade ? (<IPerson>trade).trade : trade;
            var trader = self.game.currentLocation.activeTrade;

            if ((<IPerson>trade).trade) {
                trader.currency = (<IPerson>trade).currency;
                self.game.currentLocation.activePerson = <IPerson>trade;
            }

            self.$scope.modalSettings.title = trader.title || self.texts.format(self.texts.trade, [(<IPerson>trade).name]);
            self.$scope.modalSettings.canClose = true;

            var itemsForSale = trader.sell.items;

            if (!itemsForSale) {
                itemsForSale = StoryScript.randomList<IItem>(self.game.definitions.items, trader.sell.maxItems, trader.sell.itemSelector);
            }

            trader.sell.items = itemsForSale;
            trader.buy.items = StoryScript.randomList<IItem>(self.game.character.items, trader.buy.maxItems, trader.buy.itemSelector);

            self.game.state = GameState.Trade;
        }

        closeModal = () => {
            var self = this;
            self.gameService.saveGame();
            self.game.state = GameState.Play;
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

        private watchGameState(newValue: GameState, oldValue, scope: IMainControllerScope) {
            if (oldValue != undefined) {
                // If there is a person trader, sync the money between him and the shop on trade end.
                if (oldValue == GameState.Trade) {
                    if (scope.game.currentLocation.activePerson && scope.game.currentLocation.activePerson.trade === scope.game.currentLocation.activeTrade) {
                        scope.game.currentLocation.activePerson.currency = scope.game.currentLocation.activeTrade.currency;
                    }
                }

                if ((oldValue == GameState.Combat || oldValue == GameState.Trade || oldValue == GameState.Conversation) && scope.modalSettings.closeAction) {
                    scope.modalSettings.closeAction(scope.game);
                }
            }

            if (newValue != undefined) {
                if (newValue == GameState.Combat || newValue == GameState.Trade || newValue == GameState.Conversation) {
                    $('#encounters').modal('show');
                }
                else {
                    $('#encounters').modal('hide');
                }

                (<any>scope).controller.gameService.changeGameState(newValue);
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

            for (var n in defaultTexts.texts) {
                self.texts[n] = self.customTexts[n] ? self.customTexts[n] : defaultTexts.texts[n];
            }

            self.texts.format = defaultTexts.format;
            self.texts.titleCase = defaultTexts.titleCase;
        }
    }

    MainController.$inject = ['$scope', '$window', '$sce', 'locationService', 'ruleService', 'gameService', 'game', 'customTexts'];
}