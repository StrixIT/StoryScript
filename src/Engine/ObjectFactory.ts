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
import {GetDefinitions, GetDescriptions, GetRegisteredEntities} from './ObjectConstructors';
import { ICharacterService } from './Interfaces/services/characterService';
import { IGameService } from './Interfaces/services//gameService';
import { ITradeService } from './Interfaces/services/tradeService';
import { IConversationService } from './Interfaces/services/conversationService';
import { ICombinationService } from './Interfaces/services/combinationService';
import { DataSerializer } from './Services/DataSerializer';
import { DataSynchronizer } from './Services/DataSynchronizer';

export class ObjectFactory {
    private readonly _game: IGame = <IGame>{};
    private readonly _texts: IInterfaceTexts;
    private readonly _rules: IRules;

    private readonly _characterService: ICharacterService;
    private readonly _gameService: IGameService;
    private readonly _tradeService: ITradeService;
    private readonly _conversationService: IConversationService;
    private readonly _combinationService: ICombinationService;

    private static _instance: ObjectFactory;

    constructor (
        nameSpace: string, 
        rules: IRules, 
        texts: IInterfaceTexts
    ) {
        const registeredEntities = GetRegisteredEntities();
        const descriptions = GetDescriptions();
        
        this._texts = texts;
        this._rules = rules;
        this._game.definitions = GetDefinitions();
        const localStorageService = new LocalStorageService();
        const helperService = new HelperService(this._game);
        const dataService = new DataService(localStorageService, new DataSerializer(registeredEntities), new DataSynchronizer(registeredEntities), registeredEntities, nameSpace);
        this._tradeService = new TradeService(this._game, this._texts);
        this._conversationService = new ConversationService(dataService, this._game, descriptions);
        this._characterService = new CharacterService(this._game, this._rules);
        const locationService = new LocationService(dataService, this._rules, this._game, this._game.definitions, descriptions);
        this._combinationService = new CombinationService(dataService, locationService, this._game, this._rules, this._texts);
        this._gameService = new GameService(dataService, locationService, this._characterService, this._combinationService, this._rules, helperService, this._game, this._texts);
        ObjectFactory._instance = this;
    }

    GetGame = (): IGame => this._game;

    GetRules = (): IRules => this._rules;

    GetTexts = (): IInterfaceTexts => this._texts;

    GetGameService = (): IGameService => this._gameService;

    GetTradeService = (): ITradeService => this._tradeService;

    GetConversationService = (): IConversationService => this._conversationService;

    GetCharacterService = (): ICharacterService => this._characterService;

    GetCombinationService = (): ICombinationService => this._combinationService;

    static readonly GetInstance = () => ObjectFactory._instance;
}