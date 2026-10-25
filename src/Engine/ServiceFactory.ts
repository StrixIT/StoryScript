import {
    AutoplayService,
    CharacterService,
    CombatService,
    CombinationService,
    CommandService,
    ConversationService,
    DataSerializer,
    DataService,
    DataSynchronizer,
    GameService,
    HelperService,
    ItemService,
    LocalStorageService,
    LocationService,
    SoundService,
    TradeService
} from './Services/index';

import {
    gameEvents,
    IAutoplayService,
    ICharacterService,
    ICombatService,
    ICombinationService,
    ICommandService,
    IConversationService,
    IDataSerializer,
    IDataService,
    IDataSynchronizer,
    IDefinitions,
    IGame,
    IGameService,
    IInterfaceTexts,
    IItemService,
    IRules,
    ISoundService,
    ITradeService
} from 'storyScript';

export class ServiceFactory {
    private static _instance: ServiceFactory;
    private static _initialized: boolean = false;
    private readonly _texts: IInterfaceTexts;
    private readonly _rules: IRules;
    private readonly _definitions: IDefinitions
    private readonly _registeredEntities: Record<string, Record<string, any>>;
    private readonly _dataSerializer: IDataSerializer;
    private readonly _dataSynchronizer: IDataSynchronizer;
    private readonly _dataService: IDataService;
    private _game: IGame = <IGame>{};
    private _gameService: IGameService;
    private _conversationService: IConversationService;
    private _combinationService: ICombinationService;
    private _combatService: ICombatService;
    private _soundService: ISoundService;
    private _characterService: ICharacterService;
    private _itemService: IItemService;
    private _tradeService: ITradeService;
    private _autoPlayService: IAutoplayService;
    private _commandService: ICommandService;

    constructor(
        nameSpace: string,
        definitions: IDefinitions,
        registeredEntities: Record<string, Record<string, any>>,
        rules: IRules,
        texts: IInterfaceTexts
    ) {
        this._texts = texts;
        this._rules = rules;
        this._definitions = definitions;
        this._registeredEntities = registeredEntities;
        const localStorageService = new LocalStorageService();
        this._dataSerializer = new DataSerializer(this._registeredEntities);
        this._dataSynchronizer = new DataSynchronizer(this._registeredEntities);
        this._dataService = new DataService(localStorageService, this._dataSerializer, this._dataSynchronizer, this._rules, nameSpace);
        ServiceFactory._instance = this;
    }

    get AvailableLocations() {
        return Object.values(this._registeredEntities.locations).map(l => {
            return {id: l.id, name: l.name}
        });
    };

    static readonly GetInstance = () => ServiceFactory._instance;

    /**
     * Initialize the game object and the services. Pass in a game object when it should be controlled
     * by the UI framework. Vue needs this.
     * @param game The game object.
     */
    init = (game?: IGame) => {
        this._game = game ?? <IGame>{};
        this._itemService = new ItemService(this._game, this._rules, this._texts);
        this._tradeService = new TradeService(this._itemService, this._game, this._rules, this._texts, this._definitions);
        this._conversationService = new ConversationService(this._game, this._rules);
        this._combatService = new CombatService(this._game, this._rules, this._texts);

        this._soundService = new SoundService(this._game, this._rules);
        this._characterService = new CharacterService(this._dataService, this._game, this._rules);
        const locationService = new LocationService(this._definitions, this._rules, this._game, gameEvents);
        this._combinationService = new CombinationService(this._game, this._rules, this._texts);
        this._autoPlayService = new AutoplayService(this._game, this._rules);
        this._commandService = new CommandService(locationService, this._conversationService, this._tradeService, this._combinationService, this._dataService, this._game);

        this._gameService = new GameService
        (
            this._dataService,
            locationService,
            this._characterService,
            this._combinationService,
            this._soundService,
            this._rules,
            this._game,
            this._texts
        );

        gameEvents.setGame(this._game);
        this._game.autoplay = this._autoPlayService;
        this._game.commands = this._commandService;
        this._game.helpers = new HelperService(this._game, this._definitions);

        ServiceFactory._initialized = true;
    }

    GetGame = (): IGame => this.Get(this._game);

    GetRules = (): IRules => this.Get(this._rules);

    GetTexts = (): IInterfaceTexts => this.Get(this._texts);

    GetGameService = (): IGameService => this.Get(this._gameService);

    GetTradeService = (): ITradeService => this.Get(this._tradeService);

    GetConversationService = (): IConversationService => this.Get(this._conversationService);

    GetCharacterService = (): ICharacterService => this.Get(this._characterService);

    GetCombinationService = (): ICombinationService => this.Get(this._combinationService);

    GetDataService = (): IDataService => this.Get(this._dataService);

    GetDataSerializer = (): IDataSerializer => this.Get(this._dataSerializer);

    GetDataSynchronizer = (): IDataSynchronizer => this.Get(this._dataSynchronizer);

    GetCombatService = (): ICombatService => this.Get(this._combatService);

    GetSoundService = (): ISoundService => this.Get(this._soundService);

    GetItemService = (): IItemService => this.Get(this._itemService);

    GetAutoplayService = (): IAutoplayService => this.Get(this._autoPlayService);

    GetCommandService = (): ICommandService => this.Get(this._commandService);

    private Get<T>(service: T): T {
        if (!ServiceFactory._initialized) {
            throw new Error('ServiceFactory is not initialized!');
        }

        return service;
    }
}