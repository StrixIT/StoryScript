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
        private _httpService: IHttpService = new HttpService();

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

        private init = (): void => {
            var self = this;

            if (!ObjectFactory._isInitialized)
            {
                self._helperService = new HelperService(self._game, self._rules);
                self._tradeService = new TradeService(self._game, self._texts);
                self._conversationService = new ConversationService(self._game, self._rules, self._texts);
                self._combinationService = new CombinationService(self._game, self._rules, self._texts);
                self._dataService = new DataService(self._httpService, self._localStorageService, self._eventTarget, self._game, self._nameSpace, self._definitions);
                self._locationService = new LocationService(self._dataService, self._rules, self._game, self._definitions);
                self._characterService = new CharacterService(self._dataService, self._game, self._rules);
                self._gameService = new GameService(self._dataService, self._locationService, self._characterService, self._rules, self._helperService, self._game);
                ObjectFactory._isInitialized = true;
            }
        }
    }
}