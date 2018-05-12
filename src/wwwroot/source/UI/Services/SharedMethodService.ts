namespace StoryScript 
{
    export interface ISharedMethodService {
        enemiesPresent(): boolean;
        getButtonClass(action: IAction): string;
        executeAction(action: IAction, controller: ng.IComponentController): void;
        startCombat(): void;
        trade(game: IGame, actionIndex: number, trade: ICompiledPerson | ITrade): boolean;
        showDescription(scope: ng.IScope, title: string, item: any): void;
    }

    export class SharedMethodService implements ng.IServiceProvider, ISharedMethodService {
        constructor(private _gameService: IGameService, private _tradeService: ITradeService, private _game: IGame, private _texts: IInterfaceTexts) {

        }

        public $get(gameService: IGameService, tradeService: ITradeService, game: IGame, texts: IInterfaceTexts): ISharedMethodService {
            var self = this;
            self._gameService = gameService;
            self._tradeService = tradeService;
            self._game = game;
            self._texts = texts;

            return {
                enemiesPresent: self.enemiesPresent,
                getButtonClass: self.getButtonClass,
                executeAction: self.executeAction,
                startCombat: self.startCombat,
                trade: self.trade,
                showDescription: self.showDescription
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

        executeAction = (action: IAction, controller: ng.IComponentController): void => {
            var self = this;

            if (action && action.execute) {
                // Modify the arguments collection to add the game to the collection before calling the function specified.
                var args = <any[]>[self._game, action];
                var actionIndex = self.getActionIndex(self._game, action);
                args.splice(1, 0, actionIndex)

                if (action.arguments && action.arguments.length) {
                    args = args.concat(action.arguments);
                }

                // Execute the action and when nothing or false is returned, remove it from the current location.
                var executeFunc = typeof action.execute !== 'function' ? controller[<string>action.execute] : action.execute;
                var result = executeFunc.apply(controller, args);

                // Todo: combat actions will never be removed this way.
                if (!result && self._game.currentLocation.actions) {
                    self._game.currentLocation.actions.remove(action);
                }

                // After each action, save the game.
                self._gameService.saveGame();
            }
        }

        startCombat = (): void => {
            var self = this;
            self._game.combatLog = [];
            self._game.state = GameState.Combat;
        }

        trade = (game: IGame, actionIndex: number, trade: ICompiledPerson | ITrade): boolean => {
            var self = this;
            self._tradeService.trade(trade);

            // Return true to keep the action button for trade locations.
            return true;
        }

        showDescription = (scope: ng.IScope, item: any, title: string): void => {
            var self = this;

            if (item.description) {
                self._game.state = GameState.Description;
                scope.$emit('showDescription', { title: title, item: item });
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

    SharedMethodService.$inject = ['gameService', 'tradeService', 'game', 'customTexts'];
}