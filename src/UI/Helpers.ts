import {IGame} from "storyScript/Interfaces/game.ts";
import {IAction} from "storyScript/Interfaces/action.ts";
import {ActionType} from "storyScript/Interfaces/enumerations/actionType.ts";
import {ICharacter} from "storyScript/Interfaces/character.ts";
import {IItem} from "storyScript/Interfaces/item.ts";
import {ICombinable} from "storyScript/Interfaces/combinations/combinable.ts";
import {gameEvents} from "storyScript/gameEvents.ts";

export const isDevelopment = process.env.NODE_ENV !== 'production';

export const showEquipment = (useEquipment: boolean, character: ICharacter): boolean =>
    useEquipment && character && Object.keys(character.equipment).some(k => (<any>character.equipment)[k] !== undefined);

export const canUseItem = (game: IGame, character: ICharacter, item: IItem): boolean =>
    item.use && (!item.canUse || item.canUse(game, character, item));

export const tryCombine = (game: IGame, combinable: ICombinable): boolean => {
    const result = game.combinations.tryCombine(combinable);
    return result.success;
}

export const showDescription = (game: IGame, type: string, item: any, title: string): void => {
    game.currentDescription = {title: title, type: type, item: item};
}

export const getButtonClass = (action: [string, IAction]): string => {
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

export const executeAction = (game: IGame, action: [string, IAction], saveGame: () => void): void => {
    const execute = action[1]?.execute;

    if (execute) {
        let result = true;

        if (typeof execute === 'function') {
            const actionResult = execute(game);
            result = actionResult === true;
        } else {
            gameEvents.publish(execute, action);
        }

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

const getActionIndex = (game: IGame, action: [string, IAction]): { type: ActionType, index: number } => {
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