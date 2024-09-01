import { IGame } from './Interfaces/game';
import { IInterfaceTexts } from './Interfaces/interfaceTexts';
import { IRules } from './Interfaces/rules/rules';
import { LocalStorageService } from './Services/LocalStorageService';
import { HelperService } from './Services/helperService';
import { TradeService } from './Services/TradeService';
import { DataService } from './Services/DataService';
import { ConversationService } from './Services/ConversationService';
import { LocationService } from './Services/LocationService';
import { CombinationService } from './Services/CombinationService';
import { CharacterService } from './Services/characterService';
import { GameService } from './Services/gameService';
import { ICharacterService } from './Interfaces/services/characterService';
import { IGameService } from './Interfaces/services//gameService';
import { ITradeService } from './Interfaces/services/tradeService';
import { IConversationService } from './Interfaces/services/conversationService';
import { ICombinationService } from './Interfaces/services/combinationService';
import { DataSerializer } from './Services/DataSerializer';
import { DataSynchronizer } from './Services/DataSynchronizer';
import {IHelpers} from "storyScript/Interfaces/helpers.ts";
import {IDefinitions} from "storyScript/Interfaces/definitions.ts";
import {IDataSerializer} from "storyScript/Interfaces/services/dataSerializer.ts";
import {IDataSynchronizer} from "storyScript/Interfaces/services/dataSynchronizer.ts";

export class ServiceFactory {
    private readonly _game: IGame = <IGame>{};
    private readonly _texts: IInterfaceTexts;
    private readonly _rules: IRules;
    private readonly _registeredEntities: Record<string, Record<string, any>>;
    
    private readonly _dataSerializer: IDataSerializer;
    private readonly _dataSynchronizer: IDataSynchronizer;
    private readonly _characterService: ICharacterService;
    private readonly _gameService: IGameService;
    private readonly _tradeService: ITradeService;
    private readonly _conversationService: IConversationService;
    private readonly _combinationService: ICombinationService;

    private static _instance: ServiceFactory;

    constructor (
        nameSpace: string,
        definitions: IDefinitions,
        registeredEntities: Record<string, Record<string, any>>,
        rules: IRules, 
        texts: IInterfaceTexts
    ) {
        this._texts = texts;
        this._rules = rules;
        this._registeredEntities = registeredEntities;
        const localStorageService = new LocalStorageService();
        this._dataSerializer = new DataSerializer(this._registeredEntities);
        this._dataSynchronizer = new DataSynchronizer(this._registeredEntities);
        const dataService = new DataService(localStorageService, this._dataSerializer, this._dataSynchronizer, nameSpace);
        this._tradeService = new TradeService(this._game, this._texts,definitions);
        this._conversationService = new ConversationService(this._game);
        this._characterService = new CharacterService(this._game, this._rules);
        const locationService = new LocationService(definitions, this._rules, this._game);
        this._combinationService = new CombinationService(this._game, this._rules, this._texts);
        this._gameService = new GameService(dataService, locationService, this._characterService, this._combinationService, this._rules, new HelperService(this._game, definitions), this._game, this._texts);
        ServiceFactory._instance = this;
    }

    get AvailableLocations() { 
        return Object.values(this._registeredEntities.locations).map(l => { 
            return { id: l.id, name: l.name }
        }) ;
    };

    GetGame = (): IGame => this._game;

    GetRules = (): IRules => this._rules;

    GetTexts = (): IInterfaceTexts => this._texts;

    GetGameService = (): IGameService => this._gameService;

    GetTradeService = (): ITradeService => this._tradeService;

    GetConversationService = (): IConversationService => this._conversationService;

    GetCharacterService = (): ICharacterService => this._characterService;

    GetCombinationService = (): ICombinationService => this._combinationService;

    GetDataSerializer = (): IDataSerializer => this._dataSerializer;

    GetDataSynchronizer = (): IDataSynchronizer => this._dataSynchronizer;

    static readonly GetInstance = () => ServiceFactory._instance;
}