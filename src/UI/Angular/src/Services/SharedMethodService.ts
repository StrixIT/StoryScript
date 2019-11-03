import StoryScript from '../../compiled/storyscript.js'

export interface ISharedMethodService {
    enemiesPresent(): boolean;
    trade(trade: StoryScript.IPerson | StoryScript.ITrade): boolean;
    getButtonClass(action: StoryScript.IAction): string;
    executeAction(action: StoryScript.IAction, controller: ng.IComponentController): void;
    startCombat(person?: StoryScript.IPerson): void;
    showDescription(type: string, item: any, title: string): void;
    showEquipment(): boolean;
    useCharacterSheet?: boolean;
    useEquipment?: boolean;
    useBackpack?: boolean;
    useQuests?: boolean;
    useGround?: boolean;
}

export class SharedMethodService implements ng.IServiceProvider, ISharedMethodService {
    constructor(private _gameService: StoryScript.IGameService, private _tradeService: StoryScript.ITradeService, private _game: StoryScript.IGame) {
    }

    public $get(gameService: StoryScript.IGameService, tradeService: StoryScript.ITradeService, game: StoryScript.IGame): ISharedMethodService {
        this._gameService = gameService;
        this._tradeService = tradeService;
        this._game = game;

        return {
            enemiesPresent: this.enemiesPresent,
            trade: this.trade,
            getButtonClass: this.getButtonClass,
            executeAction: this.executeAction,
            startCombat: this.startCombat,
            showDescription: this.showDescription,
            showEquipment: this.showEquipment
        };
    }

    useCharacterSheet?: boolean;
    useEquipment?: boolean;
    useBackpack?: boolean;
    useQuests?: boolean;
    useGround?: boolean;

    enemiesPresent = (): boolean => this._game.currentLocation && this._game.currentLocation.activeEnemies && this._game.currentLocation.activeEnemies.length > 0;

    trade = (trade: StoryScript.IPerson | StoryScript.ITrade): boolean => {
        this._tradeService.trade(trade);

        // Return true to keep the action button for trade locations.
        return true;
    };

    getButtonClass = (action: StoryScript.IAction): string => {
        var type = action.actionType || StoryScript.ActionType.Regular;
        var buttonClass = 'btn-';

        switch (type) {
            case StoryScript.ActionType.Regular: {
                buttonClass += 'info'
            } break;
            case StoryScript.ActionType.Check: {
                buttonClass += 'warning';
            } break;
            case StoryScript.ActionType.Combat: {
                buttonClass += 'danger';
            } break;
            case StoryScript.ActionType.Trade: {
                buttonClass += 'secondary';
            } break;
        }

        return buttonClass;
    }

    executeAction = (action: StoryScript.IAction, controller: ng.IComponentController): void => {
        if (action && action.execute) {
            // Modify the arguments collection to add the game to the collection before calling the function specified.
            var args = <any[]>[this._game, action];

            // Execute the action and when nothing or false is returned, remove it from the current location.
            var executeFunc = typeof action.execute !== 'function' ? controller[<string>action.execute] : action.execute;
            var result = executeFunc.apply(controller, args);
            var typeAndIndex = this.getActionIndex(this._game, action);

            if (!result && typeAndIndex.index !== -1) {

                if (typeAndIndex.type === StoryScript.ActionType.Regular && this._game.currentLocation.actions) {
                    this._game.currentLocation.actions.splice(typeAndIndex.index, 1);
                } else if (typeAndIndex.type === StoryScript.ActionType.Combat && this._game.currentLocation.combatActions) {
                    this._game.currentLocation.combatActions.splice(typeAndIndex.index, 1);
                }
            }

            // After each action, save the game.
            this._gameService.saveGame();
        }
    }

    startCombat = (person?: StoryScript.IPerson): void => {
        if (person) {
            // The person becomes an enemy when attacked!
            this._game.currentLocation.persons.remove(person);
            this._game.currentLocation.enemies.push(person);
        }

        this._game.combatLog = [];
        this._game.playState = StoryScript.PlayState.Combat;
    }

    showDescription = (type: string, item: any, title: string): void => this._gameService.setCurrentDescription(type, item, title);

    showEquipment = (): boolean => this.useEquipment && this._game.character && Object.keys(this._game.character.equipment).some(k => this._game.character.equipment[k] !== undefined);
    
    private getActionIndex = (game: StoryScript.IGame, action: StoryScript.IAction): { type: number, index: number} => {
        var index = -1;
        var result = {
            index: index,
            type: 0
        };

        game.currentLocation.actions.forEach((a, i) => {
            if (a === action) {
                result = {
                    index: i,
                    type: 0
                }
            }
        });

        if (index == -1) {
            game.currentLocation.combatActions.forEach((a, i) => {
                if (a === action) {
                    result = {
                        index: i,
                        type: 2
                    }
                }
            });
        }

        return result;
    }
}

SharedMethodService.$inject = ['gameService', 'tradeService', 'game'];