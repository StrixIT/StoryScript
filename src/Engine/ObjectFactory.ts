import { ILocalStorageService, ILocationService, IDataService, ICharacterService, IHelperService, IGameService, ITradeService, IConversationService, ICombinationService } from './Services/interfaces/services';
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
import { GetDefinitions } from './ObjectConstructors';

export class ObjectFactory {
    private _game: IGame = <IGame>{};
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
        this._game.definitions = GetDefinitions();
        this._helperService = new HelperService(this._game);
        this._tradeService = new TradeService(this._game, this._texts);
        this._dataService = new DataService(this._localStorageService, this._nameSpace);
        this._conversationService = new ConversationService(this._dataService, this._game);
        this._locationService = new LocationService(this._dataService, this._rules, this._game, this._game.definitions);
        this._combinationService = new CombinationService(this._dataService, this._locationService, this._game, this._rules, this._texts);
        this._characterService = new CharacterService(this._game, this._rules);
        this._gameService = new GameService(this._dataService, this._locationService, this._characterService, this._combinationService, this._rules, this._helperService, this._game, this._texts);
    }

    GetNameSpace = (): string => this._nameSpace;

    GetFunctions = (): { [type: string]: { [id: string]: { function: Function, hash: number } } } => this._functions;

    GetGame = (): IGame => this._game;

    GetTexts = (): IInterfaceTexts => this._texts;

    GetGameService = (): IGameService => this._gameService;

    GetTradeService = (): ITradeService => this._tradeService;

    GetConversationService = (): IConversationService => this._conversationService;

    GetCharacterService = (): ICharacterService => this._characterService;

    GetCombinationService = (): ICombinationService => this._combinationService;
}