import {IGame} from "storyScript/Interfaces/game.ts";
import {IAction} from "storyScript/Interfaces/action.ts";
import {ActionType} from "storyScript/Interfaces/enumerations/actionType.ts";

export const enemiesPresent = (game: IGame) => game.currentLocation?.activeEnemies?.length > 0;

export const getButtonClass = (action: IAction): string => {
    const type = action[1].actionType || ActionType.Regular;
    let buttonClass = 'btn-';

    switch (type) {
        case ActionType.Regular:
            buttonClass += 'info'
            break;
        case ActionType.Check:
            buttonClass += 'warning';
            break;
        case ActionType.Combat:
            buttonClass += 'danger';
            break;
        case ActionType.Trade:
            buttonClass += 'secondary';
            break;
    }

    return buttonClass;
}

export const executeAction = (game, action: IAction, component: any, saveGame: () => void): void => {
    const execute = action?.[1]?.execute;

    if (execute) {
        // Modify the arguments collection to add the game to the collection before calling the function specified.
        const args = <any[]>[game, action];

        // Execute the action and when nothing or false is returned, remove it from the current location.
        const executeFunc = typeof execute !== 'function' ? component[execute] : execute;
        const result = executeFunc.apply(component, args);

        const typeAndIndex = getActionIndex(game, action);

        if (!result && typeAndIndex.index !== -1) {
            if (typeAndIndex.type === ActionType.Regular && game.currentLocation.actions) {
                const currentAction = game.currentLocation.actions[typeAndIndex.index];
                game.currentLocation.actions.delete(currentAction);
            } else if (typeAndIndex.type === ActionType.Combat && game.currentLocation.combatActions) {
                const currentCombatAction = game.currentLocation.combatActions[typeAndIndex.index];
                game.currentLocation.combatActions.delete(currentCombatAction);
            }
        }

        // After each action, save the game.
        saveGame();
    }
}

const getActionIndex = (game: IGame, action: IAction): { type: ActionType, index: number } => {
    let index = -1;
    let type = ActionType.Regular;

    game.currentLocation.actions.forEach(([k, v], i) => {
        if (k === action[0]) {
            index = i;
            type = ActionType.Regular;
        }
    });

    if (index == -1) {
        game.currentLocation.combatActions.forEach(([k, v], i) => {
            if (k === action[0]) {
                index = i;
                type = ActionType.Combat;
            }
        });
    }

    return {type, index};
}