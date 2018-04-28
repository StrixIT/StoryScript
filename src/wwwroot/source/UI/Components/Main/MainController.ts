namespace StoryScript {
    export interface IModalSettings {
        title: string;
        closeText?: string;
        canClose?: boolean;
        closeAction?: (game: IGame) => void;
        descriptionEntity?: {};
    }

    export interface IMainControllerScope extends ng.IScope {
        modalSettings: IModalSettings;
        game: IGame;
        texts: any;
    }

    export class MainController {
        private $scope: IMainControllerScope;
        private $window: ng.IWindowService;
        private locationService: ILocationService;
        private rules: IRules;
        private gameService: IGameService;
        private dataService: IDataService;
        private game: IGame;
        private customTexts: IInterfaceTexts;
        private texts: IInterfaceTexts;
        private encounters: ICompiledCollection<IEnemy, ICompiledEnemy>;
        private modalSettings: IModalSettings;

        constructor($scope: IMainControllerScope, $window: ng.IWindowService, locationService: ILocationService, rules: IRules, gameService: IGameService, dataService: IDataService, game: IGame, customTexts: IInterfaceTexts) {
            var self = this;
            self.$scope = $scope;
            self.$window = $window;
            self.locationService = locationService;
            self.rules = rules;
            self.gameService = gameService;
            self.dataService = dataService;
            self.game = game;
            self.customTexts = customTexts;
            self.$scope.$on('restart', () => self.init());
            self.init();
        }

        hasDescription(type: string, item: { id?: string, description?: string }) {
            var self = this;
            return self.dataService.hasDescription(type, item);
        }

        showDescription(item: any, title: string) {
            var self = this;

            if (item.description) {
                self.showDescriptionModal(title, item);
            }
        }



        personsPresent = () => {
            var self = this;
            return self.game.currentLocation && self.game.currentLocation.activePersons.length;
        }

        barriersPresent = () => {
            var self = this;
            return self.game.currentLocation.destinations && self.game.currentLocation.destinations.some(function (destination) { return !isEmpty(destination.barrier); });
        }

        useItem = (item: IItem): void => {
            var self = this;
            item.use(self.game, item);
            self.$scope.$broadcast('refreshCombine');
        }

        initCombat = (newValue: ICompiledEnemy[]) => {
            var self = this;

            if (newValue && !newValue.some(e => !e.inactive)) {
                self.$scope.modalSettings.canClose = true;
            }

            if (newValue && self.rules.initCombat) {
                self.rules.initCombat(self.game, self.game.currentLocation);
            }

            self.$scope.$broadcast('refreshCombine');
        }

        watchPersons = (newValue: ICompiledPerson[]) => {
            var self = this;
            self.$scope.$broadcast('refreshCombine');
        }

        watchDestinations = (newValue: IDestination[]) => {
            var self = this;
            self.$scope.$broadcast('refreshCombine');
        }

        watchFeatures = (newValue: IDestination[]) => {
            var self = this;
            self.$scope.$broadcast('refreshCombine');
        }

        startCombat = () => {
            var self = this;

            self.$scope.modalSettings.title = self.texts.combatTitle;
            self.$scope.modalSettings.canClose = false;

            self.game.combatLog = [];

            self.game.state = GameState.Combat;
        }

        fight = (enemy: ICompiledEnemy) => {
            var self = this;
            self.gameService.fight(enemy);
            self.gameService.saveGame();
        }

        talk = (person: ICompiledPerson) => {
            var self = this;
            self.$scope.modalSettings.title = person.conversation.title || self.texts.format(self.texts.talk, [person.name]);
            self.$scope.modalSettings.canClose = true;
            self.game.currentLocation.activePerson = person;
            self.game.state = GameState.Conversation;
        }

        trade = (game: IGame, actionIndex: number, trade: ICompiledPerson | ITrade) => {
            var self = this;
            var isPerson = !!trade;

            self.game.currentLocation.activeTrade = isPerson ? (<ICompiledPerson>trade).trade : self.game.currentLocation.trade;
            var trader = self.game.currentLocation.activeTrade;

            if (isPerson) {
                trader.currency = (<ICompiledPerson>trade).currency;
                self.game.currentLocation.activePerson = <ICompiledPerson>trade;
            }

            self.$scope.modalSettings.title = trader.title || self.texts.format(self.texts.trade, [(<ICompiledPerson>trade).name]);
            self.$scope.modalSettings.canClose = true;
            self.game.state = GameState.Trade;

            // Return true to keep the action button for trade locations.
            return true;
        }

        closeModal = () => {
            var self = this;

            if (self.$scope.modalSettings.closeAction) {
                self.$scope.modalSettings.closeAction(self.$scope.game);
            }

            self.gameService.saveGame();

            self.$scope.$broadcast('refreshCombine');

            self.game.state = GameState.Play;
        }

        private init() {
            var self = this;
            self.gameService.init();

            self.$scope.game = self.game;

            self.setDisplayTexts();

            self.$scope.texts = self.texts;

            // Watch functions.
            self.$scope.$watch('game.currentLocation', self.watchLocation);
            self.$scope.$watch('game.character.currentHitpoints', self.watchCharacterHitpoints);
            self.$scope.$watch('game.character.score', self.watchCharacterScore);
            self.$scope.$watch('game.state', self.watchGameState);
            self.$scope.$watchCollection('game.currentLocation.enemies', self.initCombat);
            self.$scope.$watchCollection('game.currentLocation.persons', self.watchPersons);
            self.$scope.$watchCollection('game.currentLocation.destinations', self.watchDestinations);
            self.$scope.$watchCollection('game.currentLocation.features', self.watchFeatures);

            self.$scope.modalSettings = <IModalSettings>{
                title: '',
                canClose: false,
                closeText: self.texts.closeModal
            }
        }

        private showDescriptionModal(title: string, item: any) {
            var self = this;

            self.$scope.modalSettings = <IModalSettings>{
                title: title,
                closeText: self.texts.closeModal,
                canClose: true,
                descriptionEntity: item
            }

            self.game.state = GameState.Description;
        }

        private watchCharacterHitpoints(newValue, oldValue, scope) {
            if (parseInt(newValue) && parseInt(oldValue) && newValue != oldValue) {
                var change = newValue - oldValue;
                scope.$ctrl.gameService.hitpointsChange(change);
            }
        }

        private watchCharacterScore(newValue, oldValue, scope) {
            if (parseInt(newValue) && parseInt(oldValue) && newValue != oldValue) {
                var increase = newValue - oldValue;
                scope.$ctrl.gameService.scoreChange(increase);
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
            }

            if (newValue != undefined) {
                if (newValue == GameState.Combat || newValue == GameState.Trade || newValue == GameState.Conversation || newValue == GameState.Description) {
                    $('#encounters').modal('show');
                }
                else {
                    $('#encounters').modal('hide');
                }

                (<any>scope).$ctrl.gameService.changeGameState(newValue);
            }
        }

        private watchLocation(newValue: ICompiledLocation, oldValue: ICompiledLocation, scope: IMainControllerScope) {
            if (oldValue != undefined && newValue != undefined) {
                scope.game.state = GameState.Play;
            }
        }

        private setDisplayTexts() {
            var self = this;

            var defaultTexts = new DefaultTexts();

            for (var n in defaultTexts.texts) {
                self.customTexts[n] = self.customTexts[n] ? self.customTexts[n] : defaultTexts.texts[n];
            }

            self.texts = self.customTexts;
            self.texts.format = defaultTexts.format;
            self.texts.titleCase = defaultTexts.titleCase;
        }
    }

    MainController.$inject = ['$scope', '$window', 'locationService', 'rules', 'gameService', 'dataService', 'game', 'customTexts'];
}