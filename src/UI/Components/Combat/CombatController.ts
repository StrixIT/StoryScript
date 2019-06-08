namespace StoryScript {   
    export class CombatController implements ng.IComponentController {
        constructor(private _gameService: IGameService, private _sharedMethodService: ISharedMethodService, private _game: IGame, private _texts: IInterfaceTexts) {
            var self = this;
            self.game = _game;
            self.texts = _texts;
        }

        game: IGame;
        texts: IInterfaceTexts;

        enemiesPresent = () => {
            var self = this;
            return self._sharedMethodService.enemiesPresent();
        }

        getButtonClass = (action: IAction): string => {
            var self = this;
            return self._sharedMethodService.getButtonClass(action);
        }

        executeAction = (action: IAction): void => {
            var self = this;
            self._sharedMethodService.executeAction(action, self);
        }

        fight = (enemy: IEnemy): void => {
            var self = this;
            self._gameService.fight(enemy);
        }

        useItem = (item: IItem): void => {
            var self = this;
            self._gameService.useItem(item);
        }
    }

    CombatController.$inject = ['gameService', 'sharedMethodService', 'game', 'customTexts'];
}