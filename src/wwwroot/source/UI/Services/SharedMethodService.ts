namespace StoryScript 
{
    export interface ISharedMethodService {
        enemiesPresent(): boolean;
        getButtonClass(action: IAction): string;
        executeAction(action: IAction): void;
    }

    export class SharedMethodService implements ng.IServiceProvider, ISharedMethodService {
        constructor(private _gameService: IGameService, private _game: IGame) {

        }

        public $get(): ISharedMethodService {
            var self = this;

            return {
                enemiesPresent: self.enemiesPresent,
                getButtonClass: self.getButtonClass,
                executeAction: self.executeAction
            };
        }

        enemiesPresent = (): boolean => {
            var self = this;
            return self._game.currentLocation && self._game.currentLocation.activeEnemies.length > 0;
        }

        getButtonClass = (action: IAction): string => {
            var type = action.type || ActionType.Regular;
            var buttonClass = 'btn-';

            switch (type) {
                case ActionType.Regular: {
                    buttonClass += 'info'
                } break;
                case ActionType.Check: {
                    buttonClass += 'warning';
                } break;
                case ActionType.Combat: {
                    buttonClass += 'danger';
                } break;
            }

            return buttonClass;
        }

        executeAction = (action: IAction): void => {
            var self = this;

            if (action && action.execute) {
                // Modify the arguments collection to add the game to the collection before calling the function specified.
                var args = [].slice.call(arguments);
                args.shift();
                args.splice(0, 0, self._game);

                var actionIndex = self.getActionIndex(self._game, action);

                args.splice(1, 0, actionIndex)

                if (action.arguments && action.arguments.length) {
                    args = args.concat(action.arguments);
                }

                // Execute the action and when nothing or false is returned, remove it from the current location.
                var executeFunc = typeof action.execute !== 'function' ? self[<string>action.execute] : action.execute;
                var result = executeFunc.apply(this, args);

                // Todo: combat actions will never be removed this way.
                if (!result && self._game.currentLocation.actions) {
                    self._game.currentLocation.actions.remove(action);
                }

                // After each action, save the game.
                self._gameService.saveGame();
            }
        }

        private getActionIndex(game: IGame, action: IAction): number {
            var index = -1;
            var compare = (a: IAction) => a.type === action.type && a.text === action.text && a.status === action.status;

            game.currentLocation.actions.forEach((a, i) => {
                if (compare(a)) {
                    index = i;
                    return;
                }
            });

            if (index == -1) {
                game.currentLocation.combatActions.forEach((a, i) => {
                    if (compare(a)) {
                        index = i;
                        return;
                    }
                });
            }

            return index;
        }
    }

    SharedMethodService.$inject = ['gameService', 'game'];
}