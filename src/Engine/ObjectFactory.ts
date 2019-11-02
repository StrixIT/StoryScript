namespace StoryScript {
    export class ObjectFactory {
        static _isInitialized = false;

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
            this._nameSpace = nameSpace;
            this._texts = texts;
            this._rules = rules;
        }

        GetNameSpace = (): string => this._nameSpace;

        GetDefinitions = (): IDefinitions => this._definitions;

        GetFunctions = (): { [type: string]: { [id: string]: { function: Function, hash: number } } } => this._functions;

        GetGame = (): IGame => {
            this.init();
            return this._game;
        }

        GetTexts = (): IInterfaceTexts => {
            this.init();
            return this._texts;
        }

        GetGameService = (): IGameService => {
            this.init();
            return this._gameService;
        }

        GetTradeService = (): ITradeService => {
            this.init();
            return this._tradeService;
        }

        GetConversationService = (): IConversationService => {
            this.init();
            return this._conversationService;
        }

        GetCharacterService = (): ICharacterService => {
            this.init();
            return this._characterService;
        }

        GetCombinationService = (): ICombinationService => {
            this.init();
            return this._combinationService;
        }

        private init = (): void => {
            if (!ObjectFactory._isInitialized)
            {
                this.getDefinitions();
                this.registerFunctions();
                this._game.definitions = this._definitions;
                this._helperService = new HelperService(this._game);
                this._tradeService = new TradeService(this._game, this._texts);
                this._dataService = new DataService(this._localStorageService, this._nameSpace);
                this._conversationService = new ConversationService(this._dataService, this._game);
                this._locationService = new LocationService(this._dataService, this._rules, this._game, this._definitions);
                this._combinationService = new CombinationService(this._dataService, this._locationService, this._game, this._rules, this._texts);
                this._characterService = new CharacterService(this._game, this._rules);
                this._gameService = new GameService(this._dataService, this._locationService, this._characterService, this._combinationService, this._rules, this._helperService, this._game, this._texts);
                ObjectFactory._isInitialized = true;
            }
        }

        private registerFunctions = (): void => {
            var definitionKeys = getDefinitionKeys(this._definitions);
            this._functions = {};
            var index = 0;

            for (var i in this._definitions) {
                var type = definitionKeys[index] || 'actions';
                var definitions = this._definitions[i];
                this._functions[type] = {};

                for (var j in definitions) {
                    var definition = <() => {}>definitions[j];
                    definition();
                }

                index++;
            }
        }

        private getDefinitions = (): void => {
            var nameSpaceObject = window[this._nameSpace];
            this._definitions.locations = this.moveObjectPropertiesToArray(nameSpaceObject['Locations']);
            this._definitions.features = this.moveObjectPropertiesToArray(nameSpaceObject['Features']);
            this._definitions.enemies = this.moveObjectPropertiesToArray(nameSpaceObject['Enemies']);
            this._definitions.persons = this.moveObjectPropertiesToArray(nameSpaceObject['Persons']);
            this._definitions.items = this.moveObjectPropertiesToArray(nameSpaceObject['Items']);
            this._definitions.quests = this.moveObjectPropertiesToArray(nameSpaceObject['Quests']);
            this._definitions.actions = this.moveObjectPropertiesToArray(window['StoryScript']['Actions']);
            this.moveObjectPropertiesToArray(nameSpaceObject['Actions'], this._definitions.actions);
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