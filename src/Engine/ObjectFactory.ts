namespace StoryScript {
    export class ObjectFactory {
        static _isInitialized = false;
        private _eventTarget = new EventTarget(null);

        private _game: IGame = <IGame>{};
        private _definitions: IDefinitions = <IDefinitions>{};

        private _nameSpace: string;
        private _texts: IInterfaceTexts;
        private _rules: IRules;

        private _localStorageService: ILocalStorageService = new LocalStorageService();

        private _dataService: IDataService;
        private _locationService: ILocationService;
        private _characterService: ICharacterService;
        private _helperService: IHelperService;
        private _gameService: IGameService;

        private _tradeService: ITradeService;
        private _conversationService: IConversationService;
        private _combinationService: ICombinationService;

        constructor(nameSpace: string, rules: IRules, texts: IInterfaceTexts) {
            var self = this;
            self._nameSpace = nameSpace;
            self._texts = texts;
            self._rules = rules;
        }

        GetEventListener = (): EventTarget => {
            var self = this;
            return self._eventTarget;
        }

        GetGame = (): IGame => {
            var self = this;
            self.init();
            return self._game;
        }

        GetTexts = (): IInterfaceTexts => {
            var self = this;
            self.init();
            return self._texts;
        }

        GetGameService = (): IGameService => {
            var self = this;
            self.init();
            return self._gameService;
        }

        GetTradeService = (): ITradeService => {
            var self = this;
            self.init();
            return self._tradeService;
        }

        GetConversationService = (): IConversationService => {
            var self = this;
            self.init();
            return self._conversationService;
        }

        GetCharacterService = (): ICharacterService => {
            var self = this;
            self.init();
            return self._characterService;
        }

        GetCombinationService = (): ICombinationService => {
            var self = this;
            self.init();
            return self._combinationService;
        }

        GetDefinitions = (): IDefinitions => {
            var self = this;
            return self._definitions;
        }

        private init = (): void => {
            var self = this;

            if (!ObjectFactory._isInitialized)
            {
                self.getDefinitions();
                self._game.definitions = self._definitions;
                self._helperService = new HelperService(self._game, self._rules);
                self._tradeService = new TradeService(self._game, self._texts);
                self._dataService = new DataService(self._localStorageService, self._eventTarget, self._game, self._nameSpace);
                self._conversationService = new ConversationService(self._dataService, self._game, self._rules, self._texts);
                self._locationService = new LocationService(self._dataService, self._conversationService, self._rules, self._game, self._definitions);
                self._combinationService = new CombinationService(self._dataService, self._locationService, self._game, self._rules, self._texts);
                self._characterService = new CharacterService(self._dataService, self._game, self._rules);
                self._gameService = new GameService(self._dataService, self._locationService, self._characterService, self._combinationService, self._eventTarget, self._rules, self._helperService, self._game);
                ObjectFactory._isInitialized = true;
            }
        }

        private getDefinitions() {
            var self = this;
            var nameSpaceObject = window[self._nameSpace];
            self._definitions.locations = self.moveObjectPropertiesToArray(nameSpaceObject['Locations']);
            self._definitions.features = self.moveObjectPropertiesToArray(nameSpaceObject['Features']);
            self._definitions.enemies = self.moveObjectPropertiesToArray(nameSpaceObject['Enemies']);
            self._definitions.persons = self.moveObjectPropertiesToArray(nameSpaceObject['Persons']);
            self._definitions.items = self.moveObjectPropertiesToArray(nameSpaceObject['Items']);
            self._definitions.quests = self.moveObjectPropertiesToArray(nameSpaceObject['Quests']);
            self._definitions.actions = self.moveObjectPropertiesToArray(window['StoryScript']['Actions']);
            self.moveObjectPropertiesToArray(nameSpaceObject['Actions'], self._definitions.actions);
        }

        private moveObjectPropertiesToArray<T>(object: {}, collection?: (() => T)[]) {
            collection = collection || [];
            
            for (var n in object) {
                if (object.hasOwnProperty(n)) {
                    collection.push(object[n]);
                }
            }

            return collection;
        }
    }
}