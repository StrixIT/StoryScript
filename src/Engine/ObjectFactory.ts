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
import { ICharacterService } from './Interfaces/services/characterService';
import { IGameService } from './Interfaces/services//gameService';
import { ITradeService } from './Interfaces/services/tradeService';
import { IConversationService } from './Interfaces/services/conversationService';
import { ICombinationService } from './Interfaces/services/combinationService';

export class ObjectFactory {
    private _game: IGame = <IGame>{};
    private _texts: IInterfaceTexts;
    private _rules: IRules;

    private _characterService: ICharacterService;
    private _gameService: IGameService;
    private _tradeService: ITradeService;
    private _conversationService: IConversationService;
    private _combinationService: ICombinationService;

    constructor(nameSpace: string, rules: IRules, texts: IInterfaceTexts) {
        this._texts = texts;
        this._rules = rules;
        this._game.definitions = GetDefinitions();
        const localStorageService = new LocalStorageService();
        const helperService = new HelperService(this._game);
        const dataService = new DataService(localStorageService, nameSpace);
        this._tradeService = new TradeService(this._game, this._texts);
        this._conversationService = new ConversationService(dataService, this._game);
        this._characterService = new CharacterService(this._game, this._rules);
        const locationService = new LocationService(dataService, this._rules, this._game, this._game.definitions);
        this._combinationService = new CombinationService(dataService, locationService, this._game, this._rules, this._texts);
        this._gameService = new GameService(dataService, locationService, this._characterService, this._combinationService, this._rules, helperService, this._game, this._texts);
    }

    GetGame = (): IGame => this._game;

    GetTexts = (): IInterfaceTexts => this._texts;

    GetGameService = (): IGameService => this._gameService;

    GetTradeService = (): ITradeService => this._tradeService;

    GetConversationService = (): IConversationService => this._conversationService;

    GetCharacterService = (): ICharacterService => this._characterService;

    GetCombinationService = (): ICombinationService => this._combinationService;
}