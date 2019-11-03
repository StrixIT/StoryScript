import { ISharedMethodService } from '../../Services/SharedMethodService';

export class CombatController implements ng.IComponentController {
    constructor(private _gameService: StoryScript.IGameService, private _sharedMethodService: ISharedMethodService, _game: StoryScript.IGame, _texts: StoryScript.IInterfaceTexts) {
        this.game = _game;
        this.texts = _texts;
    }

    game: StoryScript.IGame;
    texts: StoryScript.IInterfaceTexts;

    enemiesPresent = (): boolean => this._sharedMethodService.enemiesPresent();

    getButtonClass = (action: StoryScript.IAction): string => this._sharedMethodService.getButtonClass(action);

    executeAction = (action: StoryScript.IAction): void => this._sharedMethodService.executeAction(action, this); 

    fight = (enemy: StoryScript.IEnemy): void => this._gameService.fight(enemy);
    
    useItem = (item: StoryScript.IItem): void => this._gameService.useItem(item);
}

CombatController.$inject = ['gameService', 'sharedMethodService', 'game', 'customTexts'];