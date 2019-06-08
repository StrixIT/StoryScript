namespace StoryScript {   
    export class ExplorationController implements ng.IComponentController {
        constructor(private _gameService: IGameService, private _sharedMethodService: ISharedMethodService, private _game: IGame, private _texts: IInterfaceTexts) {
            var self = this;
            self.game = _game;
            self.texts = _texts;
        }

        game: IGame;
        texts: IInterfaceTexts;

        actionsPresent = () => {
            var self = this;
            return !self.enemiesPresent() && !isEmpty(self.game.currentLocation.actions);
        }

        enemiesPresent = () => {
            var self = this;
            return self._sharedMethodService.enemiesPresent();
        }

        getButtonClass = (action: IAction): string => {
            var self = this;
            return self._sharedMethodService.getButtonClass(action);
        }

        getCombineClass = (barrier: IBarrier) => {
            var self = this;
            return self._game.combinations.getCombineClass(barrier);
        }

        disableActionButton = (action: IAction) => {
            var self = this;
            return typeof action.status === "function" ? (<any>action).status(self.game) == ActionStatus.Disabled : action.status == undefined ? false : (<any>action).status == ActionStatus.Disabled;
        }

        hideActionButton = (action: IAction) => {
            var self = this;
            return typeof action.status === "function" ? (<any>action).status(self.game) == ActionStatus.Unavailable : action.status == undefined ? false : (<any>action).status == ActionStatus.Unavailable;
        }

        executeAction = (action: IAction): void => {
            var self = this;
            self._sharedMethodService.executeAction(action, self);
        }

        executeBarrierAction = (destination: IDestination, barrier: IBarrier) => {
            var self = this;

            if (self._game.combinations.tryCombine(barrier))
            {
                return;
            }
            else if (self._game.combinations.activeCombination) {
                return;
            }

            self._gameService.executeBarrierAction(destination, barrier);
        }

        trade = (game: IGame, actionIndex: number, trade: IPerson | ITrade) => {
            var self = this;
            return self._sharedMethodService.trade(game, actionIndex, trade);
        }

        changeLocation = (location: string) => {
            var self = this;

            // Call changeLocation without using the execute action as the game parameter is not needed.
            self.game.changeLocation(location, true);
            self._gameService.saveGame();
        }

        pickupItem = (item: IItem): void => {
            var self = this;
            var isCombining = self._game.combinations.activeCombination;

            if (isCombining) {
                self._game.combinations.tryCombine(item)
                return;
            }

            self.game.character.items.push(item);
            self.game.currentLocation.items.remove(item);
        }
    }

    ExplorationController.$inject = ['gameService', 'sharedMethodService', 'game', 'customTexts'];
}