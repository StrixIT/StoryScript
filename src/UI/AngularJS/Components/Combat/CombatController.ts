namespace StoryScript {   
    export class CombatController implements ng.IComponentController {
        constructor(private _gameService: IGameService, private _sharedMethodService: ISharedMethodService, _game: IGame, _texts: IInterfaceTexts) {
            this.game = _game;
            this.texts = _texts;
        }

        game: IGame;
        texts: IInterfaceTexts;

        enemiesPresent = (): boolean => this._sharedMethodService.enemiesPresent();

        getButtonClass = (action: IAction): string => this._sharedMethodService.getButtonClass(action);

        executeAction = (action: IAction): void => this._sharedMethodService.executeAction(action, this); 

        fight = (enemy: IEnemy): void => this._gameService.fight(enemy);
        
        useItem = (item: IItem): void => this._gameService.useItem(item);
    }

    CombatController.$inject = ['gameService', 'sharedMethodService', 'game', 'customTexts'];
}