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

        personsPresent = () => {
            var self = this;
            return self.game.currentLocation && self.game.currentLocation.activePersons.length;
        }

        barriersPresent = () => {
            var self = this;
            return self.game.currentLocation.destinations && self.game.currentLocation.destinations.some(function (destination) { return !isEmpty(destination.barrier); });
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
 
            
            self.$scope.$watchCollection('game.currentLocation.persons', self.watchPersons);
            self.$scope.$watchCollection('game.currentLocation.destinations', self.watchDestinations);
            self.$scope.$watchCollection('game.currentLocation.features', self.watchFeatures);

            self.$scope.modalSettings = <IModalSettings>{
                title: '',
                canClose: false,
                closeText: self.texts.closeModal
            }
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