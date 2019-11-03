import { ISharedMethodService } from '../../Services/SharedMethodService';

export class EncounterController implements ng.IComponentController {
    constructor(private _sharedMethodService: ISharedMethodService, private _conversationService: StoryScript.IConversationService, private _game: StoryScript.IGame, _texts: StoryScript.IInterfaceTexts) {
        this.game = _game;
        this.texts = _texts;
    }

    game: StoryScript.IGame;
    texts: StoryScript.IInterfaceTexts;

    enemiesPresent = (): boolean => this._sharedMethodService.enemiesPresent();

    personsPresent = (): boolean => this._game.currentLocation && this._game.currentLocation.activePersons && this._game.currentLocation.activePersons.length > 0;

    getCombineClass = (item: StoryScript.IItem): string => this._game.combinations.getCombineClass(item);

    tryCombine = (person: StoryScript.IPerson): boolean => this._game.combinations.tryCombine(person);

    talk = (person: StoryScript.IPerson): void => this._conversationService.talk(person);

    trade = (trade: StoryScript.IPerson | StoryScript.ITrade): boolean => this._sharedMethodService.trade(trade);
    
    startCombat = (person: StoryScript.IPerson): void => this._sharedMethodService.startCombat(person);
}

EncounterController.$inject = ['sharedMethodService', 'conversationService', 'game', 'customTexts'];