namespace StoryScript {
    export class ObjectFactory {
        static _isInitialized = false;
        private _eventTarget = new EventTarget(null);

        private _game: IGame = <IGame>{};
        private _definitions: IDefinitions = <IDefinitions>{};
        private _functions: { [type: string]: { [id: string]: { function: Function, hash: number } } };

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

        GetNameSpace = (): string => {
            var self = this;
            return self._nameSpace;
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

        GetFunctions = (): { [type: string]: { [id: string]: { function: Function, hash: number } } } => {
            var self = this;
            return self._functions;
        }

        private init = (): void => {
            var self = this;

            if (!ObjectFactory._isInitialized)
            {
                self.getDefinitions();
                self.registerFunctions();
                self._game.definitions = self._definitions;
                self._helperService = new HelperService(self._game);
                self._tradeService = new TradeService(self._game, self._texts);
                self._dataService = new DataService(self._localStorageService, self._nameSpace);
                self._conversationService = new ConversationService(self._dataService, self._game);
                self._locationService = new LocationService(self._dataService, self._conversationService, self._rules, self._game, self._definitions);
                self._combinationService = new CombinationService(self._dataService, self._locationService, self._game, self._rules, self._texts);
                self._characterService = new CharacterService(self._game, self._rules);
                self._gameService = new GameService(self._dataService, self._locationService, self._characterService, self._combinationService, self._eventTarget, self._rules, self._helperService, self._game, self._texts);
                ObjectFactory._isInitialized = true;
            }
        }

        private registerFunctions() {
            var self = this;
            var definitionKeys = getDefinitionKeys(self._definitions);
            self._functions = {};
            var index = 0;

            for (var i in self._definitions) {
                var type = definitionKeys[index] || 'actions';
                var definitions = self._definitions[i];
                self._functions[type] = {};

                for (var j in definitions) {
                    var definition = <() => {}>definitions[j];
                    definition();
                }

                index++;
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
                    object[n] = CreateEntityProxy(object[n]);
                    collection.push(object[n]);
                }
            }

            return collection;
        }
    }
}