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
import {GetDefinitions, GetRegisteredEntities} from './ObjectConstructors';
import { ICharacterService } from './Interfaces/services/characterService';
import { IGameService } from './Interfaces/services//gameService';
import { ITradeService } from './Interfaces/services/tradeService';
import { IConversationService } from './Interfaces/services/conversationService';
import { ICombinationService } from './Interfaces/services/combinationService';
import { DataSerializer } from './Services/DataSerializer';
import { DataSynchronizer } from './Services/DataSynchronizer';

export class ServiceFactory {
    private readonly _game: IGame = <IGame>{};
    private readonly _texts: IInterfaceTexts;
    private readonly _rules: IRules;
    private readonly _registeredEntities: Record<string, Record<string, any>>;

    private readonly _characterService: ICharacterService;
    private readonly _gameService: IGameService;
    private readonly _tradeService: ITradeService;
    private readonly _conversationService: IConversationService;
    private readonly _combinationService: ICombinationService;

    private static _instance: ServiceFactory;

    constructor (
        nameSpace: string, 
        rules: IRules, 
        texts: IInterfaceTexts
    ) {
        const definitions = GetDefinitions();
        this._registeredEntities = GetRegisteredEntities();
        this._texts = texts;
        this._rules = rules;
        const localStorageService = new LocalStorageService();
        const dataService = new DataService(localStorageService, new DataSerializer(this._registeredEntities), new DataSynchronizer(this._registeredEntities), this._registeredEntities, nameSpace);
        const helperService = new HelperService(dataService, this._game, this._rules, definitions);
        this._tradeService = new TradeService(this._game, this._texts,definitions);
        this._conversationService = new ConversationService(dataService, this._game);
        this._characterService = new CharacterService(this._game, this._rules);
        const locationService = new LocationService(dataService, this._rules, this._game, this._registeredEntities);
        this._combinationService = new CombinationService(helperService, this._game, this._rules, this._texts);
        this._gameService = new GameService(dataService, locationService, this._characterService, this._combinationService, this._rules, helperService, this._game, this._texts);
        ServiceFactory._instance = this;
    }

    get RegisteredEntities() { return this._registeredEntities };

    GetGame = (): IGame => this._game;

    GetRules = (): IRules => this._rules;

    GetTexts = (): IInterfaceTexts => this._texts;

    GetGameService = (): IGameService => this._gameService;

    GetTradeService = (): ITradeService => this._tradeService;

    GetConversationService = (): IConversationService => this._conversationService;

    GetCharacterService = (): ICharacterService => this._characterService;

    GetCombinationService = (): ICombinationService => this._combinationService;

    static readonly GetInstance = () => ServiceFactory._instance;
}