namespace StoryScript 
{
    export interface ISharedMethodService {
        enemiesPresent(): boolean;
        getButtonClass(action: IAction): string;
        executeAction(action: IAction, controller: ng.IComponentController): void;
        startCombat(): void;
        trade(game: IGame, actionIndex: number, trade: IPerson | ITrade): boolean;
        showDescription(scope: ng.IScope, type: string, item: any, title: string, ): void;
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
            return self._game.currentLocation && self._game.currentLocation.activeEnemies && self._game.currentLocation.activeEnemies.length > 0;
        }

        getButtonClass = (action: IAction): string => {
            var type = action.actionType || ActionType.Regular;
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
                var actionData = self.getActionIndex(self._game, action);
                args.splice(1, 0, actionData.index)

                if (action.arguments && action.arguments.length) {
                    args = args.concat(action.arguments);
                }

                // Execute the action and when nothing or false is returned, remove it from the current location.
                var executeFunc = typeof action.execute !== 'function' ? controller[<string>action.execute] : action.execute;
                var result = executeFunc.apply(controller, args);

                if (!result && actionData.index !== -1) {
                    if (actionData.type === 'regular' && self._game.currentLocation.actions) {
                        self._game.currentLocation.actions.splice(actionData.index, 1);
                    } else if (actionData.type === 'combat' && self._game.currentLocation.combatActions) {
                        self._game.currentLocation.combatActions.splice(actionData.index, 1);
                    }
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

        trade = (game: IGame, actionIndex: number, trade: IPerson | ITrade): boolean => {
            var self = this;
            self._tradeService.trade(trade);

            // Return true to keep the action button for trade locations.
            return true;
        }

        showDescription = (scope: ng.IScope, type: string, item: any, title: string): void => {
            var self = this;

            if (item.description === undefined || item.description === null) {
                item.description = self._gameService.getDescription(type, item, 'description');
            }

            if (item.description) {
                self._game.state = GameState.Description;
                scope.$emit('showDescription', { title: title, type: type, item: item });
            }
        }

        private getActionIndex(game: IGame, action: IAction): { type: string, index: number} {
            var index = -1;
            var type: string = null;
            var compare = (a: IAction) => a.actionType === action.actionType && a.text === action.text && a.status === action.status;

            game.currentLocation.actions.forEach((a, i) => {
                if (compare(a)) {
                    index = i;
                    type = 'regular';
                    return;
                }
            });

            if (index == -1) {
                game.currentLocation.combatActions.forEach((a, i) => {
                    if (compare(a)) {
                        index = i;
                        type = 'combat';
                        return;
                    }
                });
            }

            return {
                type: type,
                index: index
            };
        }
    }

    SharedMethodService.$inject = ['gameService', 'tradeService', 'game', 'customTexts'];
}