namespace StoryScript {
    export class EncounterController implements ng.IComponentController {
        constructor(private _sharedMethodService: ISharedMethodService, private _conversationService: IConversationService, private _game: IGame, _texts: IInterfaceTexts) {
            this.game = _game;
            this.texts = _texts;
        }

        game: IGame;
        texts: IInterfaceTexts;

        enemiesPresent = (): boolean => this._sharedMethodService.enemiesPresent();

        personsPresent = (): boolean => this._game.currentLocation && this._game.currentLocation.activePersons && this._game.currentLocation.activePersons.length > 0;

        getCombineClass = (item: IItem): string => this._game.combinations.getCombineClass(item);

        tryCombine = (person: IPerson): boolean => this._game.combinations.tryCombine(person);

        talk = (person: IPerson): void => this._conversationService.talk(person);

        trade = (trade: IPerson | ITrade): boolean => this._sharedMethodService.trade(trade);
        
        startCombat = (person: IPerson): void => this._sharedMethodService.startCombat(person);
    }

    EncounterController.$inject = ['sharedMethodService', 'conversationService', 'game', 'customTexts'];
}