import {IGame} from './Interfaces/game';
import {IInterfaceTexts} from './Interfaces/interfaceTexts';
import {IRules} from './Interfaces/rules/rules';
import {LocalStorageService} from './Services/LocalStorageService';
import {HelperService} from './Services/HelperService';
import {TradeService} from './Services/TradeService';
import {DataService} from './Services/DataService';
import {ConversationService} from './Services/ConversationService';
import {LocationService} from './Services/LocationService';
import {CombinationService} from './Services/CombinationService';
import {CharacterService} from './Services/CharacterService';
import {GameService} from './Services/GameService';
import {ICharacterService} from './Interfaces/services/characterService';
import {IGameService} from './Interfaces/services//gameService';
import {ITradeService} from './Interfaces/services/tradeService';
import {IConversationService} from './Interfaces/services/conversationService';
import {ICombinationService} from './Interfaces/services/combinationService';
import {DataSerializer} from './Services/DataSerializer';
import {DataSynchronizer} from './Services/DataSynchronizer';
import {IDefinitions} from "storyScript/Interfaces/definitions.ts";
import {IDataSerializer} from "storyScript/Interfaces/services/dataSerializer.ts";
import {IDataSynchronizer} from "storyScript/Interfaces/services/dataSynchronizer.ts";
import {ICombatService} from "storyScript/Interfaces/services/combatService.ts";
import {CombatService} from "storyScript/Services/CombatService.ts";
import {ISoundService} from "storyScript/Interfaces/services/ISoundService.ts";
import {SoundService} from "storyScript/Services/SoundService.ts";
import {IDataService} from "storyScript/Interfaces/services/dataService.ts";
import {IItemService} from "storyScript/Interfaces/services/itemService.ts";
import {ItemService} from "storyScript/Services/ItemService.ts";
import {gameEvents} from "storyScript/gameEvents.ts";

export class ServiceFactory {
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

    private static _instance: ServiceFactory;

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
        this.init(this._game);
        ServiceFactory._instance = this;
    }

    get AvailableLocations() {
        return Object.values(this._registeredEntities.locations).map(l => {
            return {id: l.id, name: l.name}
        });
    };

    init = (game: IGame) => {
        this._game = game;
        this._itemService = new ItemService(this._game, this._rules, this._texts);
        this._tradeService = new TradeService(this._itemService, this._game, this._rules, this._texts, this._definitions);
        this._conversationService = new ConversationService(this._game);

        this._soundService = new SoundService(this._game, this._rules);
        this._characterService = new CharacterService(this._dataService, this._game, this._rules);
        const locationService = new LocationService(this._definitions, this._rules, this._game, gameEvents);
        this._combinationService = new CombinationService(this._game, this._rules, this._texts);
        this._gameService = new GameService
        (
            this._dataService,
            locationService,
            this._characterService,
            this._combinationService,
            this._soundService,
            this._rules,
            new HelperService(this._game, this._definitions),
            this._game,
            this._texts
        );
        this._combatService = new CombatService(this._game, this._rules, this._texts);
        gameEvents.setGame(this._game);
    }

    GetGame = (): IGame => this._game;

    GetRules = (): IRules => this._rules;

    GetTexts = (): IInterfaceTexts => this._texts;

    GetGameService = (): IGameService => this._gameService;

    GetTradeService = (): ITradeService => this._tradeService;

    GetConversationService = (): IConversationService => this._conversationService;

    GetCharacterService = (): ICharacterService => this._characterService;

    GetCombinationService = (): ICombinationService => this._combinationService;

    GetDataService = (): IDataService => this._dataService;

    GetDataSerializer = (): IDataSerializer => this._dataSerializer;

    GetDataSynchronizer = (): IDataSynchronizer => this._dataSynchronizer;

    GetCombatService = (): ICombatService => this._combatService;

    GetSoundService = (): ISoundService => this._soundService;

    GetItemService = (): IItemService => this._itemService;

    static readonly GetInstance = () => ServiceFactory._instance;
}